# Changelog

All notable changes to this project will be documented in this file.

This project follows the general structure of
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and version numbers
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) where
applicable.

## [Unreleased Working]

### Added

- Added total reported HRL habitat acres to each project detail panel, alongside
  the project's reported total acres and habitat-type breakdown.
- Expanded project-list search to cover project descriptions and funding
  sources, with curated aliases for common organizations and funding programs.
- Added search-result context that identifies the fields matching a query.
- Added general and project-specific Contact HRL actions, and clarified that a
  project's listing is for public program orientation rather than a commitment
  to fund, approve, permit, or construct it.
- Added open-source project metadata to `package.json`, including MIT license
  metadata, repository URL, issue URL, and README homepage.
- Added `CONTRIBUTING.md` with development setup, data workflow, coding
  standards, and pull request guidance.
- Added `CODE_OF_CONDUCT.md`, adapted from Contributor Covenant 3.0.
- Added HRL tributary watershed context layers for Sacramento, American,
  Feather, Yuba, Putah, Mokelumne, and Tuolumne systems, the
  Sacramento-San Joaquin Delta legal boundary, Yolo and Sutter bypass boundary
  context layers, and NHDPlus V2 stream-network PMTiles with dynamic labels for
  named mainstems and major tributaries.
- Added a quiet light basemap with DEM hillshade terrain context and an optional
  Esri World Imagery basemap mode.
- Added a Projects tab with search, system and early-implementation filters,
  accessible project browsing, project selection, zoom-to-project, and
  fit-to-visible-projects actions.
- Added filter-aware headline metric tiles.
- Added a concise About popup with Healthy Rivers and Landscapes program
  context and links to CNRA and HRL source pages.
- Added methodology and data-source context with dataset-level provenance,
  July 20, 2026 update language, schema-validation notes, download context, and
  the public HRL contact email.
- Added a Download data menu with public project downloads as GeoJSON,
  GeoPackage, and non-spatial CSV.
- Added a structured beta testing process and external form content in
  `beta-testing/`.
- Added select/clear actions for project-type, watershed, and reference-boundary
  layer groups.
- Added zoom-to-boundary actions for HRL tributary watershed, Delta, Yolo
  Bypass, and Sutter Bypass context layers.

### Changed

- Strengthened the top-bar identity with a two-line dashboard title, clearer
  purpose-text spacing, and the official transparent HRL favicon mark.
- Refreshed the generated public project data from
  `data/source/2026-07-20-v11.gpkg`.
- Clarified the relationship between reported project acres, total HRL habitat
  acres, and the habitat-type acreage breakdown in the project detail panel.
- Expanded URL state to include basemap mode and context-layer visibility.
- Updated layer controls to include basemap, watershed, Delta boundary, and
  bypass boundary, and hydrography controls.
- Updated watershed controls to use a combined HRL tributary watershed source
  with individual default-off tributary toggles.
- Updated the top-bar title to "Healthy Rivers and Landscapes Restoration
  Dashboard".
- Updated UI and map styling with a light-touch HRL-inspired accessible palette,
  smoother watershed boundaries, and blue-grey stream-network hydrography.
- Updated project selection styling with a clearer polygon halo.
- Renamed public project data objects to
  `public/data/hrl_restoration_projects.*` and trimmed public download fields
  to exclude private, source-submission, comment, and non-public funding-gap
  fields.

## [0.1.0] - 2026-06-03

### Added

- Added React, Vite, TypeScript, and MapLibre GL JS prototype application.
- Added full-bleed map rendering for restoration project polygons from
  `public/data/projects.geojson`.
- Added project-type color symbology, hover tooltip, and click-to-inspect
  project selection.
- Added top bar, headline metric tiles, and right-side project detail panel.
- Added left-rail layer controls with project-type visibility toggles and a
  Sacramento watershed boundary toggle.
- Added Sacramento watershed boundary data generated from USGS WBD HUC4 1802.
- Added URL state for map center, zoom, selected project, hidden project types,
  and watershed visibility.
- Added prototype data conversion and watershed-fetching scripts.
- Added GitHub Pages deployment workflow.
- Added repository instructions, product specification, and prototype-status
  README disclaimer.

### Changed

- Improved DOM order, text contrast, and reduced-motion handling for WCAG 2.2 AA
  alignment.

### Known Gaps at Release Time

- Project list accessibility exists at prototype level but still needs broader
  keyboard and screen-reader audit coverage.
- Full methodology page is not yet built.
- Download data affordance was not yet built.
