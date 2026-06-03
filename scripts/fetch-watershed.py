#!/usr/bin/env python3
"""
Fetch the Sacramento River watershed boundary (HUC4 1802) from the USGS
Watershed Boundary Dataset REST service, simplify it, and write the result
to public/data/watershed.geojson.

Usage:
    python scripts/fetch-watershed.py
"""

import json
import math
import pathlib
import urllib.request

OUTPUT = pathlib.Path(__file__).parent.parent / "public" / "data" / "watershed.geojson"

WBD_URL = (
    "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/2/query"
    "?where=huc4%3D'1802'"
    "&outFields=name%2Chuc4"
    "&f=geojson"
    "&outSR=4326"
)

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


def main():
    print(f"Fetching Sacramento watershed boundary from USGS WBD …")
    with urllib.request.urlopen(WBD_URL) as resp:
        data = json.load(resp)

    features = data.get("features", [])
    if not features:
        raise RuntimeError("No features returned from USGS WBD service.")

    feature = features[0]
    geom = feature["geometry"]
    rings_in = geom["coordinates"]

    rings_out = [round_coords(rdp(ring, SIMPLIFY_EPSILON), COORD_PRECISION) for ring in rings_in]
    total_pts = sum(len(r) for r in rings_out)
    geom["coordinates"] = rings_out

    out = {"type": "FeatureCollection", "features": [feature]}
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT, "w") as f:
        json.dump(out, f)

    size_kb = OUTPUT.stat().st_size // 1024
    print(f"Written {OUTPUT} — {total_pts} points, {size_kb} KB")


if __name__ == "__main__":
    main()
