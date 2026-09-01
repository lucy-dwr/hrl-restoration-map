# How the map consumes the public snapshot

## Current state

**In production the map reads the approved public snapshot from Azure.** The
deploy workflow sets `VITE_PUBLIC_SNAPSHOT_URL` to the production `current.json`
(behind the `restoration-data` Front Door route). `App.tsx` resolves the data
source from it and keeps it in React state, so the map load and all three
download links use the same resolved instance.

**Locally, and in previews and tests**, `VITE_PUBLIC_SNAPSHOT_URL` is unset and
the app uses the checked-in fixtures under `public/data/`.

The consumer seam is
[`src/data/project-data-source.ts`](../src/data/project-data-source.ts). It
provides two implementations of one `ProjectDataSource` interface:

| Source | Constructor | Used |
| --- | --- | --- |
| Approved public snapshot | `resolvePublicSnapshotProjectDataSource(currentUrl)` | Production |
| Checked-in fixture files | `createStaticProjectDataSource(import.meta.env.BASE_URL)` | Local dev, previews, tests |

The snapshot is produced by the operator-run pipeline (see
[`hrl-azure-infrastructure/PIPELINE_INFRA.md`](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-azure-infrastructure/blob/main/PIPELINE_INFRA.md)):
`hrl-pipeline promote` writes the immutable versioned public files and updates
`current.json`. There is no promotion service or queue.

## The consumer contract

The public location contains an uncacheable pointer and immutable, versioned
files. This is `hrl-pipeline promote`'s output shape
(`hrl_restoration_pipeline.publication.activate_local_snapshot` /
`publish_local`); the resolver adopts the pipeline's names, since there is one
producer.

```text
restoration-projects/
  current.json
  2026-08-31/
    metadata.json
    projects.geojson      WGS84 lng/lat (CRS84)
    projects.gpkg
    projects.csv
```

`current.json` is the whole pointer &mdash; there is no separate manifest file.
It identifies the approved snapshot and every artifact's path, relative to
`current.json` itself:

```json
{
  "snapshot_version": "2026-08-31",
  "schema_version": "v1.3.1",
  "pipeline_version": "0.3.0",
  "artifacts": {
    "projects.geojson": "2026-08-31/projects.geojson",
    "projects.gpkg": "2026-08-31/projects.gpkg",
    "projects.csv": "2026-08-31/projects.csv",
    "metadata.json": "2026-08-31/metadata.json"
  },
  "output_checksums": { "...": "..." }
}
```

The resolver reads only `snapshot_version` and the `projects.geojson` /
`projects.gpkg` / `projects.csv` entries of `artifacts` (`metadata.json` and
`output_checksums` are producer bookkeeping). It rejects a missing required
field, a failed HTTP request, or an artifact URL that moves to another origin.
It does not construct URLs from a version string &mdash; it follows only the
approved pointer.

**Serving requirements:** `current.json` is served `no-cache`; versioned
artifacts are publicly readable, have immutable cache headers, and allow the
dashboard's public origin through CORS; every URL is HTTPS behind the approved
Front Door route with no storage key, SAS token, or credential.

If either side's shape ever changes, update the pipeline
(`publication.py`), the Terraform / CORS (`prod/apps`), this resolver and its
tests, and the docs together &mdash; see
[`PIPELINE_INFRA.md` &rarr; "Cross-repository change discipline"](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-azure-infrastructure/blob/main/PIPELINE_INFRA.md#cross-repository-change-discipline).

## Rollback

**A bad published snapshot is fixed in the publication layer, not by
redeploying the map.** The map shows whatever `current.json` points at.

1. Restore `current.json` to the previous approved, immutable snapshot, using
   the publication process (re-upload the prior `current.json`, or re-run the
   operator's upload with the prior version's pointer). The versioned folders
   are immutable and still present, so this is a pointer move only.
2. Do **not** roll back to a snapshot known to be broken. In particular, never
   point `current.json` at `2026-08-27` &mdash; it predates the CRS fix and its
   coordinates are wrong.
3. The live map follows the pointer within about 10&ndash;15 minutes (Front Door
   edge cache), with no redeploy.

If the fault is in the **map's integration** rather than the data &mdash; the
resolver, the error handling, the build wiring &mdash; revert the offending map
change and deploy the previous build. The static fixtures remain as a
development and emergency-diagnosis source.

Escalation contacts:
[`hrl-azure-infrastructure/MAINTENANCE.md`](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-azure-infrastructure/blob/main/MAINTENANCE.md).

## Appendix: how the cutover happened

The map was activated against the Azure snapshot in
[#5](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-restoration-map/pull/5) /
[#6](https://github.com/Healthy-Rivers-and-Landscapes-Science/hrl-restoration-map/pull/6) (2026-08-31), after
the readiness gate below was met.

Activating it immediately surfaced a bug the static fixtures never had:
`LngLatBounds.extend()` in MapLibre throws on an out-of-range coordinate, with
no React error boundary, so the whole tree crashed to a blank page. The
published `projects.geojson` was in EPSG:3310 projected metres instead of WGS84
lon/lat. Two fixes followed, one in each repo:

- **Map:** `src/features/map/Map.tsx` skips invalid positions when computing map
  bounds instead of crashing.
- **Pipeline:** `hrl-pipeline promote` now reprojects the published
  `projects.geojson` to WGS84 / CRS84, keeps `projects.gpkg` in EPSG:3310, and
  range-checks coordinates on both submission validation and promotion. The
  corrected `2026-08-31` snapshot was re-run from the same raw submission and is
  live.

### The readiness gate that was met

1. `hrl-pipeline promote` passed an end-to-end run including human `_APPROVE`
   and a conditional `current.json` update.
2. The snapshot contains only privacy-filtered `RestorationProjectPublicRecord`
   fields.
3. The producer emits the pointer shape above, the three named artifacts, and a
   matching immutable version directory &mdash; unmodified `hrl-pipeline promote`
   output.
4. `current.json` is `no-cache`; versioned artifacts are publicly readable, have
   immutable cache headers, and allow the dashboard origin through CORS.
5. The public URL is HTTPS behind the approved Front Door route, with no
   credential.
6. A bad/missing pointer and a pointer rollback were exercised (the
   `2026-08-27` &rarr; `2026-08-31` swap was a real `current.json` move to a new
   version with no redeploy, browser-verified).
