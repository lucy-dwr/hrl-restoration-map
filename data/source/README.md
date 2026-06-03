# Source Data

Put local prototype source data here.

Current expected source: a GeoPackage containing HRL restoration project features, plus any relevant metadata.

The browser app should not read GeoPackage files directly. Add a repeatable conversion script under `scripts/` that validates and normalizes feature properties against `RestorationProjectSubmission` in `schemas/hrl/linkml/hrl_restoration_project.yaml`, then writes browser-readable generated data to `public/data/`.
