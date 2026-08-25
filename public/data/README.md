# Generated Data

Generated browser-readable data for the local prototype lives here.

Start with `hrl_restoration_projects.geojson`, `hrl_restoration_projects.gpkg`,
and `hrl_restoration_projects.csv` generated from the GeoPackage in
`data/source/` and validated against the vendored LinkML
`RestorationProjectSubmission` schema. If GeoJSON becomes too large or slow,
replace or supplement it with generated vector tiles.

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

## Future public publication seam

The deployed beta continues to read these checked-in files. The app also has a
unit-tested, inactive consumer seam in `src/data/project-data-source.ts` for a
future approved public snapshot. It expects `current.json` to identify a
version and a same-origin `manifest.json`; the manifest then identifies the
three immutable project artifacts by their public filenames. This is not an
active browser data source or approval to publish data. Coordinate the exact
pointer and manifest contract with the data-pipeline repository before the map
is switched away from this directory. The full readiness gate and activation
walkthrough are in [the public snapshot migration guide](../../docs/public-snapshot-migration.md).
