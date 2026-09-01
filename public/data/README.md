# Generated Data

Generated browser-readable data for **local development and tests** lives here.
In production the app reads the project data from the Azure public snapshot, not
from this directory (see
[`../../docs/public-snapshot-migration.md`](../../docs/public-snapshot-migration.md)).

Start with `hrl_restoration_projects.geojson`, `hrl_restoration_projects.gpkg`,
and `hrl_restoration_projects.csv`, generated from the GeoPackage in
`data/source/` by `scripts/convert-gpkg.py` and validated against the vendored
LinkML `RestorationProjectSubmission` schema. If GeoJSON becomes too large or
slow, replace or supplement it with generated vector tiles.

The project downloads are the public-facing project data objects. GeoJSON is the
browser map source and preserves multivalued fields as arrays. GeoPackage keeps
geometry and stores multivalued fields as semicolon-delimited strings for GIS
tools. CSV is non-spatial and contains attributes only.

Context layers are generated separately:
`hrl-tributary-watersheds.geojson` from the USGS WBD service for Sacramento,
American, Feather, Yuba, Putah, Mokelumne, and Tuolumne systems,
`delta-boundary.geojson` from the DWR legal Delta boundary service,
`yolo-bypass-boundary.geojson` and `sutter-bypass-boundary.geojson` from the
DWR flood bypasses service, and `streams.pmtiles` from NHDPlus V2 source data.

Files here should be reproducible from source data and conversion scripts.

## The production data source

Production reads the approved public snapshot from Azure through the consumer
seam in `src/data/project-data-source.ts`
(`resolvePublicSnapshotProjectDataSource`), following a single `current.json`
pointer - there is no separate `manifest.json`. The pipeline
(`hrl-restoration-data-pipeline`) writes `projects.geojson` / `.gpkg` / `.csv`
plus `metadata.json` per immutable version. The files in this directory are the
fixtures the seam falls back to when `VITE_PUBLIC_SNAPSHOT_URL` is unset. The
contract and the rollback procedure are in
[the public snapshot consumer contract](../../docs/public-snapshot-migration.md).
