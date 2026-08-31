# Migrating the map to an approved public snapshot

## Purpose and current state

The deployed beta reads project data from checked-in files under `public/data/`.
That remains the active source until the HRL publication workflow has produced
and approved a public snapshot.

That workflow is operator-run (see
[`hrl-azure-infrastructure/PIPELINE_INFRA.md`](https://github.com/lucy-dwr/hrl-azure-infrastructure/blob/main/PIPELINE_INFRA.md)):
an HRL data operator validates a submission with `hrl-pipeline`, and after
review runs `hrl-pipeline promote`, which writes the immutable versioned public
files and updates `current.json`. There is no promotion service or queue.

The consumer seam is [`src/data/project-data-source.ts`](../src/data/project-data-source.ts).
It provides two implementations of the same `ProjectDataSource` interface:

| Source | Constructor | Status |
| --- | --- | --- |
| Checked-in beta files | `createStaticProjectDataSource(import.meta.env.BASE_URL)` | Active |
| Approved public snapshot | `resolvePublicSnapshotProjectDataSource(currentUrl)` | Implemented but inactive |

`App.tsx` currently constructs only the static source. The map load and all
three download links receive their URLs from that source, so a later switch is
contained there rather than spread across map components.

## Required public contract

This is the map consumer's proposed contract. It is **not** an approval to
publish data and must be agreed with the data-pipeline maintainers before the
map is changed. Do not point the app at a candidate, validation report,
canonical record, or a private Azure container.

The public location must contain an uncacheable pointer and immutable,
versioned files. This is `hrl-pipeline promote`'s actual output shape
(`hrl_restoration_pipeline.publication.activate_local_snapshot` /
`publish_local`) — the resolver adopts the pipeline's names rather than the
other way around, since there is only one producer:

```text
restoration-projects/
  current.json
  2026-08-24/
    metadata.json
    projects.geojson
    projects.gpkg
    projects.csv
```

`current.json` is the whole pointer — there is no separate manifest file. It
identifies the approved snapshot and every artifact's path, relative to
`current.json` itself:

```json
{
  "snapshot_version": "2026-08-24",
  "schema_version": "v1.3.1",
  "pipeline_version": "0.4.0",
  "artifacts": {
    "projects.geojson": "2026-08-24/projects.geojson",
    "projects.gpkg": "2026-08-24/projects.gpkg",
    "projects.csv": "2026-08-24/projects.csv",
    "metadata.json": "2026-08-24/metadata.json"
  },
  "output_checksums": { "...": "..." }
}
```

The resolver only reads `snapshot_version` and the `projects.geojson` /
`projects.gpkg` / `projects.csv` entries of `artifacts` (`metadata.json` and
`output_checksums` are producer bookkeeping, not required by the map). It
rejects a missing required field, a failed HTTP request, or an artifact URL
that moves to another origin. It intentionally does not construct file URLs
from a version string; it follows only the approved pointer.

## Readiness gate

Do not activate this path until all of these are true:

1. `hrl-pipeline promote`, run by the HRL data operator, has passed a synthetic
   end-to-end acceptance run, including human `_APPROVE` and a conditional
   `current.json` update.
2. The snapshot is in the public export surface and contains only
   privacy-filtered `RestorationProjectPublicRecord` fields.
3. The producer emits the pointer shape above, the three named artifacts, and
   a matching immutable version directory (this is `hrl-pipeline promote`'s
   existing, unmodified output — no producer change is required).
4. `current.json` is served with `no-cache`; versioned artifact responses are
   publicly readable, have immutable cache headers, and allow the dashboard's
   public origin through CORS.
5. The exact public URL is HTTPS, is available through the approved Front Door
   route or other approved public endpoint, and does not require a storage key,
   SAS token, account credential, or browser authentication.
6. The operational team has tested a bad/missing pointer and a rollback by
   moving `current.json` to a preceding known-good snapshot.

The local pipeline's present development output is not, by itself, evidence
that these gates have been met.

## Activation walkthrough

1. **Confirm the contract, in place.** The map resolver
   (`src/data/project-data-source.ts`) already reads `hrl-pipeline promote`'s
   real `current.json` shape; no further reconciliation is required. If either
   side ever changes its shape, update both with tests before activation, per
   `PIPELINE_INFRA.md`'s cross-repository change discipline.

2. **Publish an approved snapshot.** Use `hrl-pipeline promote` against an
   `_APPROVE`d candidate; do not copy files manually or point the map at a
   publication candidate. Record the immutable snapshot version and the public
   pointer URL in the operational change record.

3. **Test the public endpoint before changing the app.** From a browser on the
   dashboard origin, fetch `current.json`, then each of its artifact URLs.
   Confirm the GeoJSON renders, downloads open the expected versioned files,
   and response headers meet the readiness gate.

4. **Make the small, reviewed app change.** In
   [`src/app/App.tsx`](../src/app/App.tsx), replace the static-only source
   bootstrap with an asynchronous call to
   `resolvePublicSnapshotProjectDataSource(publicCurrentUrl)`. Keep the source
   in React state so the map load and download links use the *same resolved
   instance*. Do not infer URLs from `snapshot_version`, and do not put the
   public URL, Azure account identifier, or credentials in the resolver.

   The public pointer URL belongs in reviewed deployment configuration, such as
   a Vite `VITE_` build variable, rather than in a source-code constant. Add
   it only in the production deployment after review; keep local development
   and test fixtures on `createStaticProjectDataSource` unless there is a
   deliberate integration test environment.

5. **Define failure behavior in the activation change.** A production pointer
   failure must be visible to users and operators; do not silently show stale
   checked-in data as if it were the approved snapshot. Static data remains a
   development and test fixture. The normal operational rollback is to restore
   `current.json` to the previous approved immutable snapshot.

6. **Run the map checks.** At minimum run `pnpm test:unit`, `pnpm run build`,
   `pnpm test:deployment-path`, and `pnpm test:a11y`. Add an integration test
   using a representative public pointer, malformed pointer, missing artifact,
   and rolled-back pointer before merging the activation change.

7. **Update public-facing data language.** Replace beta-specific references to
   checked-in generated data only after the endpoint is live and verified.
   Preserve the local conversion scripts and static fixtures for development,
   regression tests, and emergency diagnosis.

## Rollback

Do not redeploy the map to roll back a normal public data issue. Restore the
public `current.json` pointer to the previously approved, immutable snapshot
using the publication process. If the map integration itself is faulty, revert
the reviewed map activation change and deploy the prior static-source build.
