#!/usr/bin/env python3
"""
Fetch Sacramento River (HUC4 1802), Mokelumne (HUC8 18040012), and Tuolumne
(HUC8 18040009) watershed boundaries from the USGS Watershed Boundary Dataset
REST service, simplify them, and write browser-readable GeoJSON files to
public/data/.

Usage:
    python scripts/fetch-watershed.py
"""

import json
import math
import pathlib
import urllib.request

DATA_DIR = pathlib.Path(__file__).parent.parent / "public" / "data"

WBD_URL_TEMPLATE = (
    "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/{layer}/query"
    "?where={huc_field}%3D'{huc}'"
    "&outFields=name%2C{huc_field}"
    "&f=geojson"
    "&outSR=4326"
)

WATERSHEDS = [
    {
        "layer": 2,
        "huc_field": "huc4",
        "huc": "1802",
        "label": "Sacramento watershed",
        "output": DATA_DIR / "sacramento-watershed.geojson",
    },
    {
        "layer": 4,
        "huc_field": "huc8",
        "huc": "18040012",
        "label": "Mokelumne watershed",
        "output": DATA_DIR / "mokelumne-watershed.geojson",
    },
    {
        "layer": 4,
        "huc_field": "huc8",
        "huc": "18040009",
        "label": "Tuolumne watershed",
        "output": DATA_DIR / "tuolumne-watershed.geojson",
    },
]

SIMPLIFY_EPSILON = 0.0007  # ~75 m in decimal degrees — keeps watershed curves legible
COORD_PRECISION = 5        # decimal places


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
    with urllib.request.urlopen(WBD_URL_TEMPLATE.format(**config)) as resp:
        data = json.load(resp)

    features = data.get("features", [])
    if not features:
        raise RuntimeError(
            f"No features returned from USGS WBD service for "
            f"{config['huc_field'].upper()} {config['huc']}."
        )

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
