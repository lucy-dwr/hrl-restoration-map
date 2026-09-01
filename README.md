# Healthy Rivers and Landscapes Restoration Dashboard

This repository contains code that build an interactive map for exploring early
implementation and proposed Healthy Rivers and Landscapes (HRL) restoration
project locations in California. It is for program partners, regulators, the
public, and the contributors who help keep the dashboard useful and accurate.

> [!IMPORTANT]
> **Not an official record**
>
> This is a public program-orientation tool, not an authoritative State of
> California product, official public record, regulatory filing, or source of
> legal or policy guidance. The data and terminology may still change as the
> program and its data workflows evolve. A project appearing on the map does
> not, by itself, commit funding, approval, permitting, or construction.

![Desktop view of the HRL Restoration Dashboard with the Lower Elkhorn Basin Levee Setback selected on the map. Layer controls appear on the left, project summary tiles sit at the bottom, and the selected project's description and details appear in a panel on the right.](docs/images/dashboard-overview.png)

*An example of a dashboard view. The live public dashboard is available at
[`https://hrl.water.ca.gov/restoration-map/`](https://hrl.water.ca.gov/restoration-map/).* 

## What you can do

Interactive map exploration is supported on tablet and desktop screens. On
phone-sized screens, the dashboard provides an accessible notice with its
purpose, methodology, contact option, and data downloads; open the same link on
a larger screen to explore the map, layers, and projects.

- Browse restoration projects on a full-screen map. At broad map scales,
  projects appear as points; zoom in to see their mapped boundaries.
- Search and filter projects by name, description, organization, system,
  project type, stage, species, and funding source.
- Open a project to see its basic description, project type, acreage, target
  species, funding sources, and a public "contact HRL" option.
- Turn project types, watersheds, Delta and bypass context boundaries, stream
  network, and imagery on or off.
- Download the public project dataset as GeoJSON, GeoPackage, or CSV.
- Share a map view: the map position, selected project, and layer settings are
  represented in the URL.

## Run it locally

You do not need GIS software or a separate database to run the dashboard. The
public, browser-ready project data are included in the repository for normal
development.

### What you need

- [Node.js 24](https://nodejs.org/) or a compatible current LTS release
- [pnpm](https://pnpm.io/installation)
- A current browser on a tablet or desktop, such as Chrome, Edge, Firefox, or
  Safari

### Start the development server

From a fresh clone of this repository, run:

```sh
pnpm install
pnpm run dev
```

Vite will print a local address, usually `http://localhost:5173`. Open that
address in your browser. Stop the server with `Ctrl+C` when you are finished.

### Check a production build

```sh
pnpm run build
pnpm run preview
```

The preview command prints the local address for the built application. It is a
useful final check before opening a pull request.

### Test the public deployment path

The production dashboard's public path is
`https://hrl.water.ca.gov/restoration-map/`. Azure Front Door removes that
prefix before requesting the root-hosted files from Azure Static Web Apps, so
the production build generates browser-facing URLs beneath the prefix:

```sh
PUBLIC_BASE_PATH=/restoration-map/ pnpm run build
PUBLIC_BASE_PATH=/restoration-map/ pnpm run preview
```

Use the prefixed Playwright suite to verify the production build, including
application-owned assets, data downloads, and shareable map state:

```sh
pnpm run test:deployment-path
```

Local development and Azure Static Web Apps preview environments use the
default `/` base path. The production deployment workflow explicitly sets
`PUBLIC_BASE_PATH=/restoration-map/`; do not hard-code that path in application
code. `PUBLIC_BASE_PATH` must be an absolute path and is normalized to include
one leading and trailing slash.

The Azure Static Web App hostname is the Front Door origin and is not a
supported public dashboard URL for the prefixed production build. Direct origin
access and any future origin-bypass restrictions will be coordinated with DTS.
Application-owned public URLs must use Vite's `import.meta.env.BASE_URL` (or a
fully qualified future data URL), not an unqualified root-relative `/...` URL.

The deployed application is live at `https://hrl.water.ca.gov/restoration-map/`.
Use the Azure-generated Front Door endpoint with its `/restoration-map/` path
only for diagnostics; do not publish the direct Azure Static Web App hostname
as a dashboard link.

## Data and updates

**In production, the app reads the approved public snapshot from Azure.** The
deployment sets `VITE_PUBLIC_SNAPSHOT_URL` to the production `current.json`
(served behind the `restoration-data` Front Door route), and
`src/data/project-data-source.ts` resolves the project data, map source, and all
three downloads from it. That snapshot is produced by
[`hrl-restoration-data-pipeline`](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-restoration-data-pipeline)
and is already filtered to the public record profile - no contact details,
internal comments, source metadata, or non-public funding.

**Locally, the app uses the checked-in fixtures in `public/data/`.** A build
with no `VITE_PUBLIC_SNAPSHOT_URL` (local dev, previews, tests) reads those
files. They are reproducibly generated from a local source GeoPackage by the
scripts in [`scripts/`](scripts/README.md) and validated against the vendored
LinkML schema. They are development fixtures, not the production data path; do
not add private fields to them.

For a normal UI change, no data regeneration is needed. For the consumer
contract the app enforces on `current.json`, and the **rollback procedure** when
a published snapshot is bad, see
[How the map consumes the public snapshot](docs/public-snapshot-migration.md).
A pointer or fetch failure in production shows a visible error surface; the app
never silently falls back to stale fixtures.

## Status

The application deploys to Azure Static Web Apps, with Azure Front Door as its
public routing layer. The public dashboard is live at
`https://hrl.water.ca.gov/restoration-map/`. The direct Azure Static Web Apps
hostname remains an origin/debug endpoint, not the public dashboard URL.
Every push to `main` runs the GitHub Actions workflow, builds the Vite app with
Node 24 and pnpm, and deploys the resulting static site.

The production app reads the approved public project snapshot from Azure Blob
Storage through Azure Front Door (the `restoration-data` route). Context layers
(watersheds, boundaries, stream tiles) are still served as generated static
files committed here.

## Where to go next

| If you want to… | Start here |
| --- | --- |
| Understand product, design, data, and architecture decisions | [Specification](SPEC.md) |
| Make a code, data, or documentation contribution | [Contributing guide](CONTRIBUTING.md) |
| Run or understand accessibility checks | [Accessibility testing](docs/accessibility-testing.md) |
| Regenerate project or context layer data | [Data script guide](scripts/README.md) |
| Learn about the local source package | [Source data notes](data/source/README.md) |
| Understand the generated public data | [Generated data notes](public/data/README.md) |
| Understand how the map reads the Azure snapshot, and roll one back | [Public snapshot consumer contract](docs/public-snapshot-migration.md) |
| Review the pre-production beta-testing round records | [Beta testing](beta-testing/README.md) |
| See notable project changes | [Changelog](CHANGELOG.md) |
| Review community expectations | [Code of Conduct](CODE_OF_CONDUCT.md) |

Found a bug or have an idea? [Open an issue](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-restoration-map/issues).

## License

This project is licensed under the [MIT License](LICENSE).
