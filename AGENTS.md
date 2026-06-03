# AGENTS.md

This file explains how to work in the repo. The product, design, data, and architectural decisions live in [`SPEC.md`](SPEC.md).

Read `SPEC.md` before writing code. Treat its Decision Log as canonical, and do not reverse a logged decision without proposing a superseding entry.

## Repository Layout

The repo is still being scaffolded. When adding implementation files, follow this intended layout unless a new logged decision changes it:

```text
hrl-restoration-map-prototype/
├── AGENTS.md                  # Coding-agent and contribution instructions
├── SPEC.md                    # Umbrella product and architecture spec
├── README.md                  # Human-facing setup and contribution overview
├── data/
│   └── source/                # Local prototype source data, including GeoPackage files
├── public/                    # Static assets
│   └── data/                  # Generated browser-readable prototype data
├── schemas/
│   └── hrl/                   # Vendored LinkML schema release used by the prototype
├── src/
│   ├── app/                   # Top-level layout, routing, providers
│   ├── components/            # Reusable UI components
│   ├── features/              # Feature modules: map, tiles, panels
│   ├── data/                  # Snapshot loading, schema, validation
│   ├── styles/                # Tokens and base styles
│   └── lib/                   # Utilities and helpers
├── tests/
└── scripts/                   # Snapshot fetch and build helpers
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

This is currently a local prototype. Do not assume Azure Blob, published snapshot manifests, or `hrl-data-infrastructure` serving outputs exist yet.

## Prototype Data Workflow

The current source dataset is a GeoPackage. The app should not try to load the GeoPackage directly in the browser.

The current schema contract is the vendored LinkML schema in `schemas/hrl/linkml/hrl_restoration_project.yaml`. For now, use the `RestorationProjectSubmission` class. Do not require fields that only exist on `RestorationProjectCanonicalRecord`, such as program-assigned canonical fields, until the Azure validation/ingestion pipeline exists.

Use this workflow until the production data infrastructure exists:

1. Put the source GeoPackage under `data/source/`.
2. Add a script under `scripts/` that converts the relevant GeoPackage layer into `public/data/projects.geojson`.
3. Normalize and validate fields during conversion against `RestorationProjectSubmission` in the vendored LinkML schema.
4. Use MapLibre's GeoJSON source for the first prototype.
5. Move to generated vector tiles only if GeoJSON is too slow or too large.

Prefer a repeatable conversion command over hand-edited generated data. Generated files in `public/data/` should be replaceable from the GeoPackage.

If schema-derived TypeScript types or validators are added, generate them from the vendored LinkML schema rather than maintaining duplicate handwritten frontend schema definitions.

## Coding Conventions

- Files and directories: `kebab-case` for most files; `PascalCase` only for React component files
- TypeScript identifiers: `camelCase` for variables and functions, `PascalCase` for types and components, `SCREAMING_SNAKE_CASE` for compile-time constants
- Data fields: `snake_case` end-to-end to match `hrl-data-infrastructure`
- Use two-space indentation
- Rely on Prettier for formatting
- Prefer explicit imports over default imports for components
- Do not use `any`; use `unknown` and narrow
