# HRL Schema

This directory vendors the LinkML schema used by the **local fixture**
conversion workflow (`scripts/convert-gpkg.py`). Production data is validated by
`hrl-restoration-data-pipeline`, which pins the schema directly &mdash; this
vendored copy does not affect production.

Upstream repository: `Healthy-Rivers-and-Landscapes-Science/hrl-restoration-schema`

Vendored release: `v1.0.0` (only needs to be new enough for the fixture
conversion; the production pipeline pins `v1.3.1`). The schema `id` / `hrl`
prefix in the vendored file have been updated from the original
`lucy-dwr.github.io` namespace to the current
`healthy-rivers-and-landscapes-science.github.io` one, matching the released
schema; nothing else in the file is changed. The `id` is only an identifier
string for local validation and is not fetched.

Vendored file:

- `linkml/hrl_restoration_project.yaml`

The fixture conversion uses the `RestorationProjectSubmission` class. The app
itself consumes the **public** profile (`RestorationProjectPublicRecord`), which
the production `hrl-restoration-data-pipeline` snapshot is already filtered to.
Never render or require canonical-only or private fields (see
[`../../CONTRIBUTING.md`](../../CONTRIBUTING.md), "Privacy and Public Data").

Update process (only affects the local fixtures, never production):

1. Choose a tagged upstream release.
2. Replace `linkml/hrl_restoration_project.yaml` with the file from that tag.
3. Update the vendored release noted in this README.
4. Re-run `scripts/convert-gpkg.py`.

Do not hand-edit the vendored schema in this repo unless intentionally forking the schema contract.
