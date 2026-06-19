#!/usr/bin/env python3
"""
Build the California stream-network base layer from NHDPlus V2 and write it to
public/data/streams.pmtiles.

Why NHDPlus V2 (rather than 3DHP / NHDPlus HR): V2 carries value-added Strahler
stream order on every flowline, which is what lets us reveal smaller streams only
as the user zooms in. As of mid-2026, 3DHP does not yet have complete statewide
California coverage or the flow-network attributes V2 provides.

Stream order lives in the NHDPlusAttributes table (PlusFlowlineVAA.dbf), not on the
NHDSnapshot flowlines, so this script downloads both archives for California
(Vector Processing Unit 18) and joins them on COMID.

Pipeline:
    1. Download (or reuse) the NHDSnapshot and NHDPlusAttributes 7z archives.
    2. Extract NHDFlowline, NHDWaterbody, NHDArea, and PlusFlowlineVAA.
    3. Join flowlines on COMID, keep 5th-order-and-larger natural channels.
    4. Keep lakes, ponds, reservoirs, wide stream-river polygons, and Bay-Delta
       sea/ocean polygons, then dissolve them to remove artificial internal edges.
    5. Tag each feature with a tippecanoe minzoom hint.
    6. Pipe the result through tippecanoe to produce a vector PMTiles archive.

Geometry simplification is left to tippecanoe, which simplifies per zoom level —
that is the whole point of going to tiles rather than a flat GeoJSON.

Usage:
    pip install -r scripts/requirements.txt   # geopandas, py7zr
    brew install tippecanoe                    # or build from source
    python scripts/fetch-streams.py

If the EPA download URLs have rotated revision numbers and 404, download the two
California (VPU 18) archives by hand from
https://www.epa.gov/waterdata/get-nhdplus-national-hydrography-dataset-plus-data
drop them in data/source/nhdplus/, and re-run. The script reuses anything already
present there.
"""

import json
import pathlib
import shutil
import subprocess
import sys
import urllib.parse
import urllib.request

import geopandas as gpd
import pandas as pd
import py7zr

ROOT = pathlib.Path(__file__).parent.parent
SOURCE_DIR = ROOT / "data" / "source" / "nhdplus"
OUTPUT = ROOT / "public" / "data" / "streams.pmtiles"
TARGET_BOUNDARY = SOURCE_DIR / "wbd-huc4-1802-1804.geojson"
FLOWLINES_INTERMEDIATE = SOURCE_DIR / "ca-flowlines.geojsonl"
WATERBODIES_INTERMEDIATE = SOURCE_DIR / "ca-waterbodies.geojsonl"
STREAMS_LAYER = "streams"
WATERBODIES_LAYER = "waterbodies"
TARGET_HUC4S = ("1802", "1804")
MIN_STREAM_ORDER = 5
MIN_WATERBODY_AREA_SQKM = 0.1

# EPA-hosted NHDPlus V2 archives for California (VPU 18). The trailing two-digit
# token is a revision number that EPA bumps occasionally; update if these 404.
BASE_URL = "https://dmap-data-commons-ow.s3.amazonaws.com/NHDPlusV21/Data/NHDPlusCA"
ARCHIVES = {
    "snapshot": f"{BASE_URL}/NHDPlusV21_CA_18_NHDSnapshot_05.7z",
    "attributes": f"{BASE_URL}/NHDPlusV21_CA_18_NHDPlusAttributes_08.7z",
}

# Keep natural channels. FType = FCode // 100.
#   460 StreamRiver      — the actual stream network
# Excluded: 558 ArtificialPath, which draws center paths through waterbodies;
# 336 CanalDitch, 428 Pipeline, 566 Coastline, 334 Connector, etc.
KEEP_FTYPES = {460}
KEEP_WATERBODY_FTYPES = {"LakePond", "Reservoir"}
KEEP_AREA_FTYPES = {"SeaOcean", "StreamRiver"}

# Per-feature tippecanoe minzoom, keyed by Strahler order. The prototype ships
# only 5th-order-and-larger streams to keep the hydrography layer quiet.
def minzoom_for_order(order: int) -> int:
    if order >= 6:
        return 4
    if order == 5:
        return 6
    return 13


def download_and_extract() -> None:
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    for label, url in ARCHIVES.items():
        archive = SOURCE_DIR / pathlib.Path(url).name
        if not archive.exists():
            print(f"Downloading {label} archive … {url}")
            try:
                with urllib.request.urlopen(url) as resp, open(archive, "wb") as out:
                    shutil.copyfileobj(resp, out)
            except Exception as err:  # noqa: BLE001 — surface a clear instruction
                raise SystemExit(
                    f"Failed to download {url}\n  ({err})\n"
                    "Download the CA VPU 18 NHDSnapshot and NHDPlusAttributes "
                    "archives by hand from the EPA NHDPlus page and place them in "
                    f"{SOURCE_DIR}, then re-run."
                )
        print(f"Extracting {archive.name} …")
        with py7zr.SevenZipFile(archive, "r") as z:
            z.extractall(path=SOURCE_DIR)


def find_one(pattern: str) -> pathlib.Path:
    matches = sorted(SOURCE_DIR.rglob(pattern))
    if not matches:
        raise SystemExit(f"Could not find {pattern} under {SOURCE_DIR} after extraction.")
    return matches[0]


def fetch_target_boundary() -> gpd.GeoDataFrame:
    """Fetch or reuse the WBD HUC4 boundary for Sacramento, San Joaquin, and Bay-Delta."""
    if not TARGET_BOUNDARY.exists():
        where = " OR ".join(f"huc4='{huc4}'" for huc4 in TARGET_HUC4S)
        query = urllib.parse.urlencode(
            {
                "where": where,
                "outFields": "name,huc4",
                "f": "geojson",
                "outSR": "4326",
            }
        )
        url = f"https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/2/query?{query}"
        print(f"Fetching WBD HUC4 boundary for {', '.join(TARGET_HUC4S)} …")
        with urllib.request.urlopen(url) as resp:
            data = json.load(resp)
        features = data.get("features", [])
        if len(features) != len(TARGET_HUC4S):
            raise SystemExit(
                f"Expected {len(TARGET_HUC4S)} WBD HUC4 features, got {len(features)}."
            )
        TARGET_BOUNDARY.parent.mkdir(parents=True, exist_ok=True)
        with open(TARGET_BOUNDARY, "w") as out:
            json.dump(data, out)

    boundary = gpd.read_file(TARGET_BOUNDARY).to_crs(epsg=4326)
    print(
        "Using target WBD HUC4 boundary: "
        + ", ".join(sorted(str(huc4) for huc4 in boundary["huc4"]))
    )
    return boundary


def clip_to_target(gdf: gpd.GeoDataFrame, boundary: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    return gpd.clip(gdf, boundary.geometry.union_all())


def target_bbox(boundary: gpd.GeoDataFrame) -> tuple[float, float, float, float]:
    minx, miny, maxx, maxy = boundary.total_bounds
    return (float(minx), float(miny), float(maxx), float(maxy))


def build_flowlines(boundary: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    flowline_path = find_one("NHDFlowline.shp")
    vaa_path = find_one("PlusFlowlineVAA.dbf")

    print(f"Reading flowlines: {flowline_path.relative_to(ROOT)}")
    flow = gpd.read_file(
        flowline_path,
        columns=["COMID", "GNIS_NAME", "FCODE"],
        bbox=target_bbox(boundary),
    )
    flow = flow.to_crs(epsg=4326)
    flow.columns = [c.upper() if c != "geometry" else c for c in flow.columns]

    print(f"Reading stream order: {vaa_path.relative_to(ROOT)}")
    vaa = gpd.read_file(vaa_path, columns=["ComID", "StreamOrde"], ignore_geometry=True)
    vaa.columns = [c.upper() for c in vaa.columns]
    vaa = pd.DataFrame(vaa)[["COMID", "STREAMORDE"]]

    merged = flow.merge(vaa, on="COMID", how="left")
    merged["FTYPE"] = (merged["FCODE"].fillna(0).astype(int) // 100)
    merged = merged[merged["FTYPE"].isin(KEEP_FTYPES)].copy()

    merged["STREAMORDE"] = merged["STREAMORDE"].fillna(0).astype(int)
    # Keep only larger natural channels. Lower-order streams add too much visual
    # noise at the dashboard's intended browsing scales.
    merged = merged[merged["STREAMORDE"] >= MIN_STREAM_ORDER].copy()
    merged = clip_to_target(merged, boundary)

    print(
        f"Kept {len(merged):,} natural flowlines of "
        f"{MIN_STREAM_ORDER}th order or larger inside HUC4 1802/1804."
    )
    return merged


def build_waterbodies(boundary: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    waterbody_path = find_one("NHDWaterbody.shp")
    area_path = find_one("NHDArea.shp")
    bbox = target_bbox(boundary)

    print(f"Reading waterbodies: {waterbody_path.relative_to(ROOT)}")
    waterbodies = gpd.read_file(
        waterbody_path,
        columns=["GNIS_NAME", "FTYPE", "FCODE", "AREASQKM"],
        bbox=bbox,
    ).to_crs(epsg=4326)
    waterbodies = waterbodies[waterbodies["FTYPE"].isin(KEEP_WATERBODY_FTYPES)].copy()
    waterbodies["AREASQKM"] = waterbodies["AREASQKM"].fillna(0).astype(float)
    waterbodies = waterbodies[waterbodies["AREASQKM"] >= MIN_WATERBODY_AREA_SQKM].copy()

    print(f"Reading hydro areas: {area_path.relative_to(ROOT)}")
    areas = gpd.read_file(
        area_path,
        columns=["GNIS_NAME", "FTYPE", "FCODE", "AREASQKM"],
        bbox=bbox,
    ).to_crs(epsg=4326)
    combined = gpd.GeoDataFrame(
        pd.concat(
            [waterbodies, areas[areas["FTYPE"].isin(KEEP_AREA_FTYPES)].copy()],
            ignore_index=True,
        ),
        crs=waterbodies.crs,
    )

    print(
        f"Kept {len(combined):,} lake, reservoir, wide-river, "
        "and sea/ocean polygons before target-boundary clipping "
        f"(lake/reservoir minimum: {MIN_WATERBODY_AREA_SQKM} sq km)."
    )
    return combined


def waterbody_minzoom(area_sqkm: float) -> int:
    if area_sqkm >= 50:
        return 5
    if area_sqkm >= 10:
        return 7
    if area_sqkm >= 1:
        return 10
    return 12


def dissolve_waterbodies(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Union water polygons so shared NHD source boundaries do not render."""
    valid = gdf[gdf.geometry.notna() & ~gdf.geometry.is_empty].copy()
    if valid.empty:
        return valid

    # Dissolve in a projected CRS so area and the tiny seam-closing buffer are in
    # metres. The 1 m buffer avoids hairline gaps where adjacent NHD polygons are
    # nearly, but not exactly, coincident.
    projected = valid.to_crs(epsg=3310)
    projected.geometry = projected.geometry.make_valid()
    dissolved_geometry = projected.geometry.buffer(1).union_all().buffer(-1)
    dissolved = gpd.GeoDataFrame(geometry=[dissolved_geometry], crs=projected.crs)
    dissolved = dissolved.explode(index_parts=False).reset_index(drop=True)
    dissolved = dissolved[
        dissolved.geometry.notna()
        & ~dissolved.geometry.is_empty
        & dissolved.geometry.geom_type.isin(["Polygon", "MultiPolygon"])
    ].copy()
    dissolved["AREASQKM"] = dissolved.geometry.area / 1_000_000
    dissolved["FTYPE"] = "Waterbody"
    dissolved["FCODE"] = 0
    dissolved["GNIS_NAME"] = ""
    dissolved = dissolved.to_crs(epsg=4326)
    print(f"Dissolved water polygons into {len(dissolved):,} rendered features.")
    return dissolved


def write_flowlines_geojsonl(gdf: gpd.GeoDataFrame) -> None:
    """Write newline-delimited GeoJSON with a per-feature tippecanoe minzoom hint."""
    out = gpd.GeoDataFrame(
        {
            "geometry": gdf.geometry,
            "streamorder": gdf["STREAMORDE"].astype(int),
            "gnis_name": gdf["GNIS_NAME"].fillna("").astype(str),
            "fcode": gdf["FCODE"].fillna(0).astype(int),
        },
        crs="EPSG:4326",
    )
    out["tippecanoe"] = out["streamorder"].map(
        lambda o: {"minzoom": minzoom_for_order(int(o))}
    )
    print(f"Writing intermediate GeoJSONSeq: {FLOWLINES_INTERMEDIATE.relative_to(ROOT)}")
    out.to_file(FLOWLINES_INTERMEDIATE, driver="GeoJSONSeq")


def write_waterbodies_geojsonl(gdf: gpd.GeoDataFrame) -> None:
    out = gpd.GeoDataFrame(
        {
            "geometry": gdf.geometry,
            "feature_type": gdf["FTYPE"].fillna("").astype(str),
            "gnis_name": gdf["GNIS_NAME"].fillna("").astype(str),
            "fcode": gdf["FCODE"].fillna(0).astype(int),
            "area_sqkm": gdf["AREASQKM"].fillna(0).astype(float),
        },
        crs="EPSG:4326",
    )
    out["tippecanoe"] = out["area_sqkm"].map(
        lambda area: {"minzoom": waterbody_minzoom(float(area))}
    )
    print(f"Writing intermediate GeoJSONSeq: {WATERBODIES_INTERMEDIATE.relative_to(ROOT)}")
    out.to_file(WATERBODIES_INTERMEDIATE, driver="GeoJSONSeq")


def run_tippecanoe() -> None:
    if shutil.which("tippecanoe") is None:
        raise SystemExit(
            "tippecanoe not found on PATH. Install it (`brew install tippecanoe`) "
            "and re-run; the filtered flowlines are already written to "
            f"{FLOWLINES_INTERMEDIATE.relative_to(ROOT)}."
        )
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "tippecanoe",
        "-o", str(OUTPUT),
        "-Z4", "-z13",
        "--drop-densest-as-needed",
        "--simplification=2",
        "--no-feature-limit",
        "--force",
        "-L", f"{WATERBODIES_LAYER}:{WATERBODIES_INTERMEDIATE}",
        "-L", f"{STREAMS_LAYER}:{FLOWLINES_INTERMEDIATE}",
    ]
    print("Running:", " ".join(cmd))
    subprocess.run(cmd, check=True)
    size_mb = OUTPUT.stat().st_size / (1024 * 1024)
    print(f"Written {OUTPUT.relative_to(ROOT)} — {size_mb:.1f} MB")


def main() -> None:
    download_and_extract()
    boundary = fetch_target_boundary()
    waterbodies = clip_to_target(build_waterbodies(boundary), boundary)
    print(f"Kept {len(waterbodies):,} water polygons inside HUC4 1802/1804.")
    waterbodies = dissolve_waterbodies(waterbodies)
    flowlines = build_flowlines(boundary)
    write_flowlines_geojsonl(flowlines)
    write_waterbodies_geojsonl(waterbodies)
    run_tippecanoe()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
