#!/usr/bin/env python3
"""
Fetch Sacramento River (HUC4 1802) and San Joaquin (HUC4 1804) watershed
boundaries from the USGS Watershed Boundary Dataset REST service, simplify
them, and write browser-readable GeoJSON files to public/data/.

Usage:
    python scripts/fetch-watershed.py
"""

import json
import math
import pathlib
import urllib.request

DATA_DIR = pathlib.Path(__file__).parent.parent / "public" / "data"

WBD_URL_TEMPLATE = (
    "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/2/query"
    "?where=huc4%3D'{huc4}'"
    "&outFields=name%2Chuc4"
    "&f=geojson"
    "&outSR=4326"
)

WATERSHEDS = [
    {
        "huc4": "1802",
        "label": "Sacramento watershed",
        "output": DATA_DIR / "watershed.geojson",
    },
    {
        "huc4": "1804",
        "label": "San Joaquin watershed",
        "output": DATA_DIR / "san-joaquin-watershed.geojson",
    },
]

SIMPLIFY_EPSILON = 0.002  # ~200 m in decimal degrees — keeps outline recognisable
COORD_PRECISION = 4       # decimal places


def point_line_dist(p, a, b):
    if a == b:
        return math.hypot(p[0] - a[0], p[1] - a[1])
    dx, dy = b[0] - a[0], b[1] - a[1]
    t = max(0.0, min(1.0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)))
    return math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)


def rdp(pts, eps):
    """Ramer-Douglas-Peucker polyline simplification."""
    if len(pts) < 3:
        return list(pts)
    dmax, idx = 0.0, 0
    for i in range(1, len(pts) - 1):
        d = point_line_dist(pts[i], pts[0], pts[-1])
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        return rdp(pts[: idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [pts[0], pts[-1]]


def round_coords(ring, precision):
    return [[round(c, precision) for c in pt] for pt in ring]


def simplify_geometry(geom):
    geom_type = geom["type"]
    if geom_type == "Polygon":
        geom["coordinates"] = [
            round_coords(rdp(ring, SIMPLIFY_EPSILON), COORD_PRECISION)
            for ring in geom["coordinates"]
        ]
    elif geom_type == "MultiPolygon":
        geom["coordinates"] = [
            [
                round_coords(rdp(ring, SIMPLIFY_EPSILON), COORD_PRECISION)
                for ring in polygon
            ]
            for polygon in geom["coordinates"]
        ]
    else:
        raise RuntimeError(f"Unsupported geometry type: {geom_type}")


def count_points(geom):
    if geom["type"] == "Polygon":
        return sum(len(ring) for ring in geom["coordinates"])
    return sum(len(ring) for polygon in geom["coordinates"] for ring in polygon)


def fetch_watershed(config):
    print(f"Fetching {config['label']} boundary from USGS WBD ...")
    with urllib.request.urlopen(WBD_URL_TEMPLATE.format(huc4=config["huc4"])) as resp:
        data = json.load(resp)

    features = data.get("features", [])
    if not features:
        raise RuntimeError(f"No features returned from USGS WBD service for HUC4 {config['huc4']}.")

    feature = features[0]
    geom = feature["geometry"]
    simplify_geometry(geom)
    total_pts = count_points(geom)

    out = {"type": "FeatureCollection", "features": [feature]}
    output = config["output"]
    output.parent.mkdir(parents=True, exist_ok=True)
    with open(output, "w") as f:
        json.dump(out, f)

    size_kb = output.stat().st_size // 1024
    print(f"Written {output} -- {total_pts} points, {size_kb} KB")


def main():
    for config in WATERSHEDS:
        fetch_watershed(config)


if __name__ == "__main__":
    main()
