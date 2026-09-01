# Source Data

Local source GeoPackage for the **development and test fixtures** in
`public/data/`. Production project data does not come from here - it is the
approved public snapshot published by `hrl-restoration-data-pipeline` (see
[`../../docs/public-snapshot-migration.md`](../../docs/public-snapshot-migration.md)).

Current source: `2026-07-20-v13.gpkg`, a GeoPackage of HRL restoration project
features and metadata.

The browser app never reads a GeoPackage directly. `scripts/convert-gpkg.py`
validates and normalizes feature properties against `RestorationProjectSubmission`
in `schemas/hrl/linkml/hrl_restoration_project.yaml` and writes the
browser-readable fixtures to `public/data/`.
