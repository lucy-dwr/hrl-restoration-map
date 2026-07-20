# Source Data

Put local prototype source data here.

Current source: `2026-07-20-v13.gpkg`, a GeoPackage containing HRL restoration
project features and relevant metadata.

The browser app should not read GeoPackage files directly. Add a repeatable conversion script under `scripts/` that validates and normalizes feature properties against `RestorationProjectSubmission` in `schemas/hrl/linkml/hrl_restoration_project.yaml`, then writes browser-readable generated data to `public/data/`.
