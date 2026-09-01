# Contributing

Thank you for your interest in contributing to `hrl-restoration-map`. This
repository contains the early-implementation Healthy Rivers and Landscapes
restoration map, deployed through Azure Static Web Apps behind Azure Front
Door. It is not an
authoritative State of California product, official public record, regulatory
filing, or source of legal or policy guidance.

## Code of Conduct

All contributors are expected to follow the project
[Code of Conduct](CODE_OF_CONDUCT.md).

## Before You Start

Read [SPEC.md](SPEC.md) before proposing or writing code. Treat the Decision Log
in that file as canonical. Do not reverse a logged decision without proposing a
superseding entry.

**Data sources.** In production the deployed app reads the approved public
snapshot from Azure &mdash; `current.json` behind the `restoration-data` Front
Door route, resolved in `src/data/project-data-source.ts`. The checked-in files
under `public/data/` are the **local development and test fixtures**; a build
with no `VITE_PUBLIC_SNAPSHOT_URL` set (local dev, previews, tests) uses them.
The production serving infrastructure lives in
[`hrl-azure-infrastructure`](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-azure-infrastructure),
and the pipeline that produces the snapshot is
[`hrl-restoration-data-pipeline`](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-restoration-data-pipeline).
See [`docs/public-snapshot-migration.md`](docs/public-snapshot-migration.md) for
the consumer contract and the rollback procedure.

## Development Setup

This project uses React, Vite, TypeScript, MapLibre GL JS, and pnpm.

```sh
pnpm install
pnpm run dev
```

Useful checks:

```sh
pnpm run build
pnpm exec playwright install chromium # once, after dependencies are installed
pnpm run test:a11y
pnpm run test:deployment-path
```

Production builds use the browser-visible `/restoration-map/` base path, while
local development and Azure Static Web Apps preview environments use `/`.
Application-owned assets and data URLs must use `import.meta.env.BASE_URL`.
See the [README deployment-path guidance](README.md#test-the-public-deployment-path)
before changing deployment, asset, or public-data loading behavior.

See [Accessibility testing](docs/accessibility-testing.md) for the automated
test scope, how to investigate failures, temporary exception requirements, and
the manual review checklist. New interactive components need coverage for their
important states, not only their initial rendering.

## Data Workflow

**Production project data is not generated in this repository.** It comes from
`hrl-restoration-data-pipeline` (`hrl-pipeline promote`), which writes the
privacy-filtered public snapshot the deployed app reads. Do not use the scripts
below to change what production shows.

The scripts below regenerate the **local fixtures and the context layers**
(watersheds, boundaries, streams). The browser app never reads a source
GeoPackage directly.

1. Put source GeoPackage files under `data/source/`.
2. Run `python scripts/convert-gpkg.py` to generate the local project fixtures
   `public/data/hrl_restoration_projects.geojson`,
   `public/data/hrl_restoration_projects.gpkg`, and
   `public/data/hrl_restoration_projects.csv`.
3. Run `python scripts/fetch-watershed.py` to generate
   `public/data/hrl-tributary-watersheds.geojson`.
4. Run `python scripts/fetch-delta-boundary.py` to generate
   `public/data/delta-boundary.geojson`.
5. Run `python scripts/fetch-bypass-boundaries.py` to generate
   `public/data/yolo-bypass-boundary.geojson` and
   `public/data/sutter-bypass-boundary.geojson`.
6. Run `python scripts/fetch-streams.py` to generate
   `public/data/streams.pmtiles`.
7. Keep generated files replaceable by re-running the scripts.

The fixture conversion normalizes and validates project data against the
vendored LinkML `RestorationProjectSubmission` schema in
`schemas/hrl/linkml/hrl_restoration_project.yaml`. The vendored copy is for the
local fixture workflow only; the authoritative schema is
[`hrl-restoration-schema`](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-restoration-schema)
and the production pipeline pins it directly.

The app consumes the **public** profile
(`RestorationProjectPublicRecord`) &mdash; the pipeline's public snapshot is
already filtered to it. Do not render or require canonical-only or private
fields (see "Privacy and Public Data" below).

## Privacy and Public Data

Some source fields are not approved for public display in the application. Do
not render or expose these fields without explicit approval:

- `contact_name`
- `contact_email`
- `funding_secured`
- `funding_gap`
- `estimated_budget_comments`
- `construction_completion_year_comments`
- source submission metadata such as `source_slug`, `source_agency`,
  `submission_version`, `source_file`, and `source_feature_number`

Map data must align with the schema provided in `schemas/hrl/linkml/hrl_restoration_project.yaml`.

## Coding Standards

- Use TypeScript in strict mode.
- Use two-space indentation and rely on Prettier formatting.
- Use explicit imports for React components.
- Do not use `any`; prefer `unknown` and narrow the type.
- Keep files and directories in `kebab-case`, except React component files,
  which may use `PascalCase`.
- Use CSS modules or vanilla-extract. Do not add runtime CSS-in-JS.
- Prefer existing design tokens in `src/styles/tokens.css`.
- Preserve WCAG 2.2 Level AA accessibility as a baseline.

## Pull Requests

For pull requests, please include:

- A clear summary of the change.
- Any relevant issue or decision-log context.
- Screenshots or screen recordings for visible UI changes.
- Notes about data regeneration, if generated files changed.
- Verification steps, including commands run.
- Any accessibility considerations for user-facing changes.

Keep pull requests focused. Avoid unrelated refactors unless they are necessary
for the change being proposed.

## Issues

When opening an issue, include enough context for maintainers to reproduce or
evaluate it:

- What you expected to happen.
- What actually happened.
- Browser and operating system, for UI issues.
- Relevant project, layer, or data field, for map and data issues.
- Screenshots, URLs, or query parameters when useful.

For data issues, please distinguish between source-data problems, conversion
problems, and display problems when possible.
