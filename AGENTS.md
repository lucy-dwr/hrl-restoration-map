# AGENTS.md

This file explains how to work in the repo. The product, design, data, and architectural decisions live in [`SPEC.md`](SPEC.md).

Read `SPEC.md` before writing code. Treat its Decision Log as canonical, and do not reverse a logged decision without proposing a superseding entry.

The cross-repository data workflow (how the approved public snapshot is produced
and what this map reads) is described in
[`hrl-azure-infrastructure/PIPELINE_INFRA.md`](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-azure-infrastructure/blob/main/PIPELINE_INFRA.md);
roles and ownership are in
[`hrl-azure-infrastructure/DIVISION_OF_RESPONSIBILITIES.md`](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-azure-infrastructure/blob/main/DIVISION_OF_RESPONSIBILITIES.md).
That workflow is operator-run: an HRL data operator validates and promotes
submissions with `hrl-pipeline` and uploads the versioned public snapshot plus
`current.json`. There is no ingestion service, queue, or Container App.

**In production this map reads that Azure snapshot** through
`resolvePublicSnapshotProjectDataSource` in `src/data/project-data-source.ts`
(wired via `VITE_PUBLIC_SNAPSHOT_URL`). The checked-in `public/data/` project
files are the local dev / preview / test fixtures. See Decision 60 and
[`docs/public-snapshot-migration.md`](docs/public-snapshot-migration.md).

## Current Implementation Status

The early-implementation dashboard is deployed to Azure Static Web Apps. What
exists:

- Full-bleed MapLibre map rendering project polygons (in production from the Azure public snapshot via `src/data/project-data-source.ts`; locally from the `public/data/` fixture), with project-type colour symbology, hover tooltip, selection halo, and click-to-inspect selection.
- Low-zoom overview point markers for polygon projects, placed at a guaranteed-interior "point on surface" of each footprint (not a bounding-box/area centroid, which can fall outside concave shapes) and cross-fading into the true polygon fill/outline on a per-project schedule driven by footprint size, so small projects stay discoverable at the default extent (addresses Round 1 R1-08). A zoom-reactive on-map hint and a first-run overlay sentence explain that points expand into boundaries on zoom-in.
- On initial load without shared URL state, the map auto-fits to the bounds of all currently visible projects (max zoom 9) rather than a fixed default extent; a shared URL's exact centre and zoom are honoured instead.
- Top bar branded as "Healthy Rivers and Landscapes Restoration Dashboard" with compact purpose text, a Download data menu, About popup, public-status guidance, and a general Contact HRL action.
- First-run orientation overlay that frames the map as a public overview of early implementation and proposed restoration project locations, not verified habitat accounting.
- Filter-aware headline tiles strip (project count and total project acres).
- Right-side detail panel with type badges, description, overview, reported project acres, total HRL habitat acres and habitat-type acreage breakdown, target species, funding sources, zoom-to-project, and project-specific Contact HRL actions.
- Left-rail panel with Layers and Projects tabs. The Layers tab has basemap radio controls, per-type visibility checkboxes, select/clear layer-group actions, individual HRL tributary watershed toggles and zoom actions, Delta legal-boundary and Yolo/Sutter bypass-boundary toggles and zoom actions, and a stream-network toggle. The Projects tab has search across project names, descriptions, lead entities, systems, types, stages, target species, and funding sources (with curated acronym aliases), system and early-implementation filters, an accessible project list, project selection/zoom actions, and fit-to-visible-projects.
- HRL tributary watershed boundary layer (`public/data/hrl-tributary-watersheds.geojson`) sourced from USGS WBD for Sacramento, American, Feather, Yuba, Putah, Mokelumne, and Tuolumne systems.
- Sacramento-San Joaquin Delta legal boundary layer (`public/data/delta-boundary.geojson`) sourced from the DWR `i03_LegalDeltaBoundary` ArcGIS service.
- Yolo and Sutter bypass boundary layers (`public/data/yolo-bypass-boundary.geojson`, `public/data/sutter-bypass-boundary.geojson`) sourced from the DWR `i12_Flood_Bypasses_2014` ArcGIS service for representational context.
- California stream-network base layer (`public/data/streams.pmtiles`) built from NHDPlus V2 (VPU 18), served as vector tiles via the `pmtiles://` protocol with zoom-dependent reveal by Strahler stream order and dynamic labels for named mainstems / major tributaries.
- Quiet light basemap with MapLibre-rendered DEM hillshade terrain context, HRL-inspired accessible UI palette, blue-grey hydrography, and optional Esri World Imagery inspection mode.
- URL state encoding map centre/zoom, selected project, hidden types, basemap mode, boundary visibility, and stream-network visibility as query parameters.
- Design tokens in `src/styles/tokens.css`; WCAG-AA-passing colour contrast for all text.

**Accessibility hardening status:** Automated WCAG A/AA regression checks cover
representative dashboard states, and a thorough but non-exhaustive VoiceOver
audit has been completed. The methodology/data source context, concise About
popup, project list non-map equivalent, and download data affordance are in
place. Broader manual keyboard, assistive technology, zoom, motion, and
forced-colors review is still needed before calling accessibility complete.

## Repository Layout

```text
hrl-restoration-map/
├── AGENTS.md                  # Coding-agent and contribution instructions
├── SPEC.md                    # Umbrella product and architecture spec
├── README.md                  # Human-facing setup and contribution overview
├── beta-testing/              # Structured beta testing protocol and form content
├── docs/                      # public-snapshot-migration.md, accessibility-testing.md, specs/
├── data/
│   └── source/                # Local source data, including GeoPackage files
├── public/
│   └── data/
│       ├── hrl_restoration_projects.geojson  # LOCAL FIXTURE (dev/test only); production reads the Azure snapshot
│       ├── hrl_restoration_projects.gpkg  # local fixture, via scripts/convert-gpkg.py
│       ├── hrl_restoration_projects.csv  # local fixture, via scripts/convert-gpkg.py
│       ├── hrl-tributary-watersheds.geojson  # context layer (served in prod), from USGS WBD
│       ├── delta-boundary.geojson  # Fetched from DWR via scripts/fetch-delta-boundary.py
│       ├── yolo-bypass-boundary.geojson  # Fetched from DWR via scripts/fetch-bypass-boundaries.py
│       ├── sutter-bypass-boundary.geojson  # Fetched from DWR via scripts/fetch-bypass-boundaries.py
│       └── streams.pmtiles    # Built from NHDPlus V2 via scripts/fetch-streams.py
├── schemas/
│   └── hrl/                   # Vendored LinkML schema release used by the app
├── src/
│   ├── app/                   # App.tsx, App.module.css, main.tsx
│   ├── components/
│   │   ├── detail-panel/      # Click-to-inspect project panel
│   │   ├── layer-panel/       # Collapsible layer toggle rail
│   │   ├── tiles/             # Headline metric tiles
│   │   └── top-bar/           # Program identity and navigation bar
│   ├── data/                  # project-data-source.ts (the snapshot/fixture seam), types.ts
│   ├── features/
│   │   └── map/               # MapLibre map component and project-type colour palette
│   ├── lib/                   # url-state.ts — URL read/write utilities
│   └── styles/                # global.css, tokens.css
├── tests/                     # accessibility/ and deployment-path/ (Playwright), data/ (Vitest)
└── scripts/
    ├── convert-gpkg.py        # Builds the LOCAL project fixture from data/source/*.gpkg
    ├── fetch-watershed.py     # Fetches HRL tributary watershed boundaries from USGS WBD
    ├── fetch-delta-boundary.py # Fetches Sacramento-San Joaquin Delta legal boundary from DWR
    ├── fetch-bypass-boundaries.py # Fetches Yolo and Sutter bypass boundaries from DWR
    ├── fetch-streams.py       # Builds California stream network PMTiles from NHDPlus V2
    └── requirements.txt       # Python deps for the data-prep scripts
```

Do not add new top-level implementation directories unless the need is clear and consistent with the spec.

## Technical Defaults

Use the stack decisions in `SPEC.md` Section 10:

- React with Vite
- TypeScript in strict mode
- MapLibre GL JS for map rendering
- deck.gl for heavy or analytical layers
- CSS modules or vanilla-extract; no runtime CSS-in-JS
- React context plus URL-as-source-of-truth first; consider Zustand only if complexity warrants it
- Vitest for unit tests and Playwright for critical end-to-end paths
- pnpm as the package manager

The application deploys to Azure Static Web Apps through GitHub Actions. In
production it reads the project snapshot from Azure Blob Storage through Azure
Front Door (Decision 60); the infrastructure repository is
`hrl-azure-infrastructure`. Tile hosting on Azure Blob is still anticipated,
not built.

## Local fixture data workflow

The scripts below regenerate the **local fixtures and context layers**, not the
production project data (that comes from `hrl-restoration-data-pipeline`). The
app should not load a GeoPackage directly in the browser.

The fixture conversion validates against the vendored LinkML schema in
`schemas/hrl/linkml/hrl_restoration_project.yaml` (`RestorationProjectSubmission`
class). The app consumes the public-record profile, which the production
snapshot is already filtered to; never render or require canonical-only or
private fields.

1. Put the source GeoPackage under `data/source/`.
2. Run `python scripts/convert-gpkg.py` to convert the relevant layer into `public/data/hrl_restoration_projects.geojson`, `public/data/hrl_restoration_projects.gpkg`, and `public/data/hrl_restoration_projects.csv`. Normalise and validate fields against `RestorationProjectSubmission` during conversion.
3. Run `python scripts/fetch-watershed.py` to fetch and simplify HRL tributary watershed boundaries from the USGS WBD REST service and write them to `public/data/hrl-tributary-watersheds.geojson`.
4. Run `python scripts/fetch-delta-boundary.py` to fetch and simplify the Sacramento-San Joaquin Delta legal boundary from the DWR ArcGIS service and write it to `public/data/delta-boundary.geojson`.
5. Run `python scripts/fetch-bypass-boundaries.py` to fetch and simplify the representational Yolo and Sutter bypass boundaries from the DWR `i12_Flood_Bypasses_2014` ArcGIS service and write them to `public/data/yolo-bypass-boundary.geojson` and `public/data/sutter-bypass-boundary.geojson`.
6. Run `python scripts/fetch-streams.py` to build the California stream-network base layer from NHDPlus V2 (VPU 18) and write it to `public/data/streams.pmtiles`. This script needs the Python deps in `scripts/requirements.txt` plus the `tippecanoe` CLI.
7. Use MapLibre's GeoJSON source for vector features that are small enough; use PMTiles vector tiles (read via the `pmtiles://` protocol) for large base layers such as the stream network.

Prefer a repeatable conversion command over hand-edited generated data. Generated files in `public/data/` should be replaceable by re-running the scripts above. The stream network is the first layer that moved to vector tiles because the raw NHDPlus flowline set is far too large to ship as GeoJSON.

If schema-derived TypeScript types or validators are added, generate them from the vendored LinkML schema rather than maintaining duplicate handwritten frontend schema definitions.

## Coding Conventions

- Files and directories: `kebab-case` for most files; `PascalCase` only for React component files
- TypeScript identifiers: `camelCase` for variables and functions, `PascalCase` for types and components, `SCREAMING_SNAKE_CASE` for compile-time constants
- Data fields: `snake_case` end-to-end to match the HRL schema and pipeline output
- Use two-space indentation
- Rely on Prettier for formatting
- Prefer explicit imports over default imports for components
- Do not use `any`; use `unknown` and narrow
