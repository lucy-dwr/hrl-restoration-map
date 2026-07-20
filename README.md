# Healthy Rivers and Landscapes Restoration Dashboard

This repository contains code that build an interactive map for exploring early
implementation and proposed Healthy Rivers and Landscapes (HRL) restoration
project locations in California. It is for program partners, regulators, the
public, and the contributors who help keep the dashboard useful and accurate.

> [!WARNING]
> **Beta dashboard**
>
> This is not an authoritative State of California product, official public
> record, regulatory filing, or source of legal or policy guidance. The data,
> design, terminology, and behavior will continue to change as the HRL
> dashboard and its supporting data workflows mature. A project appearing on
> the map does not, by itself, commit funding, approval, permitting, or
> construction.

![Desktop view of the HRL Restoration Dashboard with the Lower Elkhorn Basin Levee Setback selected on the map. Layer controls appear on the left, project summary tiles sit at the bottom, and the selected project's description and details appear in a panel on the right.](docs/images/dashboard-overview.png)

*An example of a dashboard view. Visit the [deployed dashboard](https://kind-sky-052e1711e.7.azurestaticapps.net) to explore it.*

## What you can do

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

- [Node.js 22](https://nodejs.org/) or a compatible current LTS release
- [pnpm](https://pnpm.io/installation)
- A current desktop browser, such as Chrome, Edge, Firefox, or Safari

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

## Data and updates

Today, the app serves checked-in, browser-ready files from `public/data/`.
Those public GeoJSON, GeoPackage, and CSV downloads are reproducibly generated
from the local source GeoPackage and validated against the vendored HRL LinkML
schema. The browser never reads the source GeoPackage directly.

The conversion process removes submission contact details, internal comments,
source metadata, and non-public funding information before public data are
produced. Do not add those fields back to the app or downloads without explicit
approval.

For a normal UI change, no data regeneration is needed. If you are updating
project or context-layer data, start with the [data script guide](scripts/README.md).
The project will move to reading a published Azure-hosted data object when the
HRL data-serving workflow is ready; until then, the checked-in generated files
are the source used by the deployed app.

## Status

The application is deployed on [Azure Static Web Apps](https://kind-sky-052e1711e.7.azurestaticapps.net).
Every push to `main` runs the GitHub Actions workflow, builds the Vite app with
Node 22 and pnpm, and deploys the resulting static site.

Application hosting is in place, but the production HRL data-serving
infrastructure, published snapshot manifests, and Azure-hosted data/tile
delivery are still future work. The current deployment uses the generated static
data committed in this repository.

## Where to go next

| If you want to… | Start here |
| --- | --- |
| Understand product, design, data, and architecture decisions | [Specification](SPEC.md) |
| Make a code, data, or documentation contribution | [Contributing guide](CONTRIBUTING.md) |
| Regenerate project or context-layer data | [Data script guide](scripts/README.md) |
| Learn about the local source package | [Source data notes](data/source/README.md) |
| Understand the generated public data | [Generated data notes](public/data/README.md) |
| Review the structured beta-testing process | [Beta testing](beta-testing/round-1/README.md) |
| See notable project changes | [Changelog](CHANGELOG.md) |
| Review community expectations | [Code of Conduct](CODE_OF_CONDUCT.md) |

Found a bug or have an idea? [Open an issue](https://github.com/lucy-dwr/hrl-restoration-map/issues).

## License

This project is licensed under the [MIT License](LICENSE).
