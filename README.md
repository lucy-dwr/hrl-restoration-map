# hrl-restoration-map-prototype

Prototype interactive map for visualizing Healthy Rivers and Landscapes
restoration projects.

> [!WARNING]
> **Development prototype**
>
> This application is an in-development prototype. It is not an authoritative
> State of California product, official public record, regulatory filing, or
> source of legal or policy guidance. Data, design, terminology, and behavior may
> change as the Healthy Rivers and Landscapes dashboard and supporting data
> workflows mature.

## Status

This repository is currently a local prototype. Azure hosting, published
snapshot manifests, and the production HRL data-serving infrastructure are not
set up yet.

The prototype includes:

- Full-bleed MapLibre map with project polygons from
  `public/data/projects.geojson`
- Project-type color symbology, hover tooltip, and click-to-inspect selection
- Top bar, headline metric tiles, and right-side project detail panel
- Left-rail layer controls for project types and the Sacramento watershed
  boundary
- Sacramento watershed boundary from USGS WBD HUC4 1802
- URL state for map center, zoom, selected project, hidden project types, and
  watershed visibility

Not yet included:

- Non-map accessible project list
- About and methodology page
- Download data affordance

## Quick Start

This project uses React, Vite, TypeScript, MapLibre GL JS, and pnpm.

```sh
pnpm install
pnpm run dev
```

Build the prototype with:

```sh
pnpm run build
```

## Data Workflow

The browser app does not load source GeoPackage files directly. Use the
repeatable prototype workflow:

1. Keep source GeoPackage files in `data/source/`.
2. Validate and normalize data against the vendored LinkML
   `RestorationProjectSubmission` schema in `schemas/hrl/linkml/`.
3. Run `python scripts/convert-gpkg.py` to generate
   `public/data/projects.geojson`.
4. Run `python scripts/fetch-watershed.py` to generate
   `public/data/watershed.geojson`.
5. Run the app locally with Vite.

Generated files in `public/data/` should be replaceable by re-running the
scripts.

## Repository Guide

- [SPEC.md](SPEC.md) contains product, design, data, and architecture decisions.
- [AGENTS.md](AGENTS.md) contains implementation conventions for coding agents
  and contributors.
- [CONTRIBUTING.md](CONTRIBUTING.md) explains development workflow and pull
  request expectations.
- [CHANGELOG.md](CHANGELOG.md) records notable changes.
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) describes community expectations.

## License

This project is licensed under the [MIT License](LICENSE).
