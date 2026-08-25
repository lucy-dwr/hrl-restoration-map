# Migrating the map to an approved public snapshot

## Purpose and current state

The deployed beta reads project data from checked-in files under `public/data/`.
That remains the active source until the HRL publication workflow in Azure has 
produced and approved a public snapshot.

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
versioned files:

```text
restoration-projects/
  current.json
  2026-08-24/
    manifest.json
    hrl_restoration_projects.geojson
    hrl_restoration_projects.gpkg
    hrl_restoration_projects.csv
```

`current.json` identifies the approved snapshot and its manifest relative to
the pointer:

```json
{
  "snapshot_version": "2026-08-24",
  "manifest": "2026-08-24/manifest.json"
}
```

`manifest.json` identifies each artifact relative to the manifest. It may have
additional producer metadata and checksums, but the fields below are required
by the current resolver:

```json
{
  "snapshot_version": "2026-08-24",
  "artifacts": {
    "hrl_restoration_projects.geojson": {
      "path": "hrl_restoration_projects.geojson"
    },
    "hrl_restoration_projects.gpkg": {
      "path": "hrl_restoration_projects.gpkg"
    },
    "hrl_restoration_projects.csv": {
      "path": "hrl_restoration_projects.csv"
    }
  }
}
```

The resolver rejects a missing required field, a disagreement between the two
snapshot versions, a failed HTTP request, or a manifest/artifact URL that
moves to another origin. It intentionally does not construct file URLs from a
version string; it follows only the approved pointer and manifest.

## Readiness gate

Do not activate this path until all of these are true:

1. The restoration promotion workflow has passed its synthetic end-to-end
   acceptance run, including human approval and a conditional `current.json`
   update.
2. The snapshot is in the public export surface and contains only
   privacy-filtered `RestorationProjectPublicRecord` fields.
3. The producer emits the agreed pointer and manifest shape above, the three
   named artifacts, and a matching immutable version directory.
4. `current.json` is served with `no-cache`; versioned manifest and artifact
   responses are publicly readable, have immutable cache headers, and allow
   the dashboard's public origin through CORS.
5. The exact public URL is HTTPS, is available through the approved Front Door
   route or other approved public endpoint, and does not require a storage key,
   SAS token, account credential, or browser authentication.
6. The operational team has tested a bad/missing pointer and a rollback by
   moving `current.json` to a preceding known-good snapshot.

The local pipeline's present development output is not, by itself, evidence
that these gates have been met.

## Activation walkthrough

1. **Agree and test the contract first.** Add matching producer tests in
   `hrl-restoration-data-pipeline` for the exact `current.json`,
   `manifest.json`, filenames, cache headers, and CORS behavior. Keep the map
   resolver tests aligned with any approved contract change.

2. **Publish an approved snapshot.** Use the promotion workflow; do not copy
   files manually or point the map at a publication candidate. Record the
   immutable snapshot version and the public pointer URL in the operational
   change record.

3. **Test the public endpoint before changing the app.** From a browser on the
   dashboard origin, fetch `current.json`, then its manifest and each artifact.
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
