#!/usr/bin/env python3
"""
Fetch the Sacramento-San Joaquin Delta legal boundary from the California
Department of Water Resources ArcGIS service, simplify it, and write the result
to public/data/delta-boundary.geojson.

Usage:
    python scripts/fetch-delta-boundary.py
"""

import json
import math
import pathlib
import urllib.request

OUTPUT = pathlib.Path(__file__).parent.parent / "public" / "data" / "delta-boundary.geojson"

DELTA_BOUNDARY_URL = (
    "https://utility.arcgis.com/usrsvcs/servers/3efc635b27344a3da989ca1e7108f5e0/rest/services/"
    "Boundaries/i03_LegalDeltaBoundary/MapServer/0/query"
    "?where=1%3D1"
    "&outFields=Source%2CEdited_By%2CDate_Record_Last_Updated%2CDate_Data_Applies_To"
    "&f=geojson"
    "&outSR=4326"
)

SIMPLIFY_EPSILON = 0.0003  # ~30 m in decimal degrees; preserves cadastral-scale shape
COORD_PRECISION = 5


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


def simplify_ring(ring):
    if len(ring) < 4:
        return ring

    is_closed = ring[0] == ring[-1]
    pts = ring[:-1] if is_closed else ring
    simplified = rdp(pts, SIMPLIFY_EPSILON)

    if is_closed and simplified[0] != simplified[-1]:
        simplified.append(simplified[0])
    return simplified


def round_coords(ring, precision):
    return [[round(c, precision) for c in pt] for pt in ring]


def simplify_geometry(geom):
    geom_type = geom["type"]
    if geom_type == "Polygon":
        geom["coordinates"] = [
            round_coords(simplify_ring(ring), COORD_PRECISION)
            for ring in geom["coordinates"]
        ]
    elif geom_type == "MultiPolygon":
        geom["coordinates"] = [
            [
                round_coords(simplify_ring(ring), COORD_PRECISION)
                for ring in polygon
            ]
            for polygon in geom["coordinates"]
        ]
    else:
        raise RuntimeError(f"Unsupported geometry type: {geom_type}")


def main():
    print("Fetching Delta legal boundary from DWR ArcGIS service ...")
    with urllib.request.urlopen(DELTA_BOUNDARY_URL) as resp:
        data = json.load(resp)

    features = data.get("features", [])
    if not features:
        raise RuntimeError("No features returned from DWR Delta boundary service.")

    for feature in features:
        simplify_geometry(feature["geometry"])
        props = feature.setdefault("properties", {})
        props["name"] = "Sacramento-San Joaquin Delta legal boundary"
        props["source_service"] = "DWR i03_LegalDeltaBoundary"

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT, "w") as f:
        json.dump({"type": "FeatureCollection", "features": features}, f)

    total_pts = 0
    for feature in features:
        geom = feature["geometry"]
        if geom["type"] == "Polygon":
            total_pts += sum(len(ring) for ring in geom["coordinates"])
        else:
            total_pts += sum(len(ring) for polygon in geom["coordinates"] for ring in polygon)

    size_kb = OUTPUT.stat().st_size // 1024
    print(f"Written {OUTPUT} -- {len(features)} feature(s), {total_pts} points, {size_kb} KB")


if __name__ == "__main__":
    main()
