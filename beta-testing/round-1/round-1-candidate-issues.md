# Round 1 Candidate Issue Backlog

These are triaged candidates derived from
`hrl-restoration-map-prototype-feedback-round-1.csv`.

Priority meanings:

- **P0:** Blocks credible broader sharing.
- **P1:** Should address before a broader internal/external beta.
- **P2:** Useful improvement, but workable in current prototype.
- **P3:** Defer or track as future scope.

Definition/help pattern:

Use a consistent layered approach for terms that affect interpretation or trust:
make the visible label clear first, add targeted keyboard-accessible info
popovers for high-risk terms, and back those short definitions with a
methodology/data dictionary page. Prioritize this pattern for submitted
acreage, project stage/status, early implementation, project type, data
source/update information, and any future accounting terms.

## R1-01: Clarify what acreage numbers represent

**Problem:**

Users cannot tell whether acreage means project footprint, habitat-accounting
credit, acreage meeting design criteria, submitted acreage, or habitat-specific
acreage.

**Evidence:**

Multiple reviewers asked for clear acreage definitions. Specific concerns
included Tisdale Weir Reoperation appearing to show 10,000 acres despite a much
smaller-looking footprint, acreage totals not adding up on project pages, and
confusion between project area acres and habitat acres meeting design criteria.

**Impact:**

This directly reduces confidence in using the map in review, meeting, or
communication products.

**Affected area:**

Headline tiles, project detail panel, project list, inline help/popover
component, methodology/data dictionary, data conversion/data QA.

**Possible fix:**

Label the tile and project record acreage values as submitted project acreage or
project footprint acreage with a definition drawn from the HRL restoration data
schema. Apply the backlog-wide definition/help pattern: use clear visible
labels, add short accessible help for acreage terms, and link to the
methodology/data dictionary for fuller caveats. Flag records where acreage basis
needs data-owner review.

**Priority:**

P0

**Labels:**

`content`, `data-quality`, `methodology`, `usability`

## R1-02: Add data source, update, and methodology context

**Problem:**

Users cannot see where project facts came from, when they were updated, or how
submitted data were standardized.

**Evidence:**

Reviewers asked for source materials, update timing, budget year/basis, target
species source, and connections to information outside HRL. Lack of source
materials was called out as reducing confidence.

**Impact:**

The map may look polished but still feel insufficiently defensible for regulator
or public communication.

**Affected area:**

About popup, full methodology page, project detail panel, data downloads.

**Possible fix:**

Create the v1 methodology page and use it as the authoritative data dictionary
for field definitions, source notes, update cadence, and caveats. Add concise
source/update language in About and targeted inline help where provenance
affects interpretation. Add project-level source/version fields only when
approved and available.

**Priority:**

P0

**Labels:**

`content`, `methodology`, `data-quality`

## R1-03: Improve first-load purpose and audience orientation

**Problem:**

The map's purpose is not self-evident to all expert reviewers, and some read it
as an internal accounting/tracking tool rather than a public/regulator overview.

**Evidence:**

Purpose clarity was 3 very clear, 3 somewhat clear, and 1 not clear. One
reviewer said it had no context and served HRL insiders. Others asked whether
the intent was public overview, agency use, or habitat accounting.

**Impact:**

Public and regulator users may misunderstand the product before they reach the
About popup.

**Affected area:**

First-run experience, top bar, About popup, methodology.

**Possible fix:**

Implement the first-run orientation overlay described in `SPEC.md`. Make the
About control more discoverable. Add one concise visible sentence that frames
the map as submitted/proposed HRL restoration project locations and basic
descriptions.

**Priority:**

P1

**Labels:**

`content`, `usability`

## R1-04: Clarify project status/stage labels

**Problem:**

Project stage and construction timing are ambiguous in the detail panel.

**Evidence:**

Reviewers asked whether construction means completion date, requested status
labels such as design/permitting/construction/completed, and found combined
phase text such as "Delta Post-construction monitoring and science" hard to
interpret.

**Impact:**

Users may misread project maturity and rely on incorrect assumptions in
meetings or communication products.

**Affected area:**

Project detail panel, inline help/popover component, data model display rules,
methodology/data dictionary.

**Possible fix:**

Use clearer visible labels first, such as "Project stage" or "Current stage,"
instead of bare values like "Construction." Add targeted, keyboard-accessible
info popovers for high-risk terms such as project stage/status, submitted
acreage, early implementation, and project type, following the backlog-wide
definition/help pattern. Keep each popover short and link to a methodology/data
dictionary page with the fuller definitions, source notes, and caveats. Decide
how multivalued stage values should be summarized for display while preserving
submitted values in downloads.

**Priority:**

P1

**Labels:**

`content`, `data-quality`, `usability`

## R1-05: Add or scope individual tributary/watershed boundaries

**Problem:**

Several reviewers expected individual HRL tributary or watershed boundaries that
are not currently shown.

**Evidence:**

Requested boundaries included Feather, Yuba, American, Putah, and other HRL
tributaries. Existing watershed boundaries were described as useful by some
reviewers but incomplete or confusing by others.

**Impact:**

The map can appear incomplete or insider-oriented, especially for users trying
to orient to a familiar tributary.

**Affected area:**

Layer catalog, layer panel, data scripts, map symbology.

**Possible fix:**

Add more tributary boundaries: Yuba River, Feather River, American River, Putah
Creek, Friant River. Retain the existing boundaries for the Sacramento River,
the Tuolumne River, and the Mokelumne River.

**Priority:**

P1

**Labels:**

`cartography`, `content`, `feature-request`

## R1-06: Distinguish watershed boundary symbology from stream network

**Problem:**

The Sacramento watershed boundary can be confused with streams because colors
are visually similar.

**Evidence:**

One reviewer specifically noted the Sacramento watershed boundary was similar in
color to the stream network and parallel to the American River.

**Impact:**

Users may misread context layers at first glance.

**Affected area:**

Map layer styles, design tokens.

**Possible fix:**

Adjust watershed boundary color, opacity, line pattern, or labels so watershed
outlines read as boundaries rather than hydrography.

**Priority:**

P2

**Labels:**

`cartography`, `usability`

## R1-07: Strengthen selected-project styling

**Problem:**

Selection can be hard to see where projects overlap or share the same type
color.

**Evidence:**

One reviewer had difficulty discerning which Feather River project was selected
because overlapping projects were differentiated mainly by a thicker outline in
the same color.

**Impact:**

Users may inspect the wrong project or lose confidence in map/list
coordination.

**Affected area:**

Map project layers, selection state styling.

**Possible fix:**

Use a stronger selection halo, contrast outline, lift order, or temporary
centroid marker for selected projects.

**Priority:**

P1

**Labels:**

`cartography`, `usability`, `accessibility`

## R1-08: Improve low-zoom visibility for small projects

**Problem:**

Small projects are difficult to see at the default extent.

**Evidence:**

Reviewers said everything starts off small, projects are difficult to see at the
default scale, and it can look like no projects exist in familiar areas until
zooming in.

**Impact:**

The map's first impression can understate project distribution and make the
dashboard feel incomplete.

**Affected area:**

Map rendering, first-run extent, project layer symbology.

**Possible fix:**

Add low-zoom centroid/summary markers or region counts. Consider scale-dependent
styling that makes small projects discoverable without compromising polygon
inspection at closer zooms. Initialize the map with a more zoomed-in view,
rather than the full Bay-Delta watershed.

**Priority:**

P1

**Labels:**

`cartography`, `usability`

## R1-09: Confirm and improve multivalued project-type filtering

**Problem:**

Projects with multiple project types may only appear under their primary/first
type in filters or layer visibility.

**Evidence:**

One reviewer reported that "Upstream of Old LaGrange Bridge Restoration
Project" has four categories assigned but only appears when "fish food
production" is selected.

**Impact:**

Users asking "where are all fish passage/rearing/etc. projects?" may get
incomplete answers.

**Affected area:**

Layer visibility logic, Projects tab filters, project symbology, data model
display rules.

**Possible fix:**

Verify behavior. Make filters match any assigned project type. Keep map color
based on a documented primary type, and apply the backlog-wide definition/help
pattern so users understand the difference between primary-type symbology and
any-type filtering.

**Priority:**

P1

**Labels:**

`data-quality`, `usability`

## R1-10: Make active filters visible across Layers and Projects tabs

**Problem:**

Users can miss that a filter or hidden layer from one tab is constraining the
results they see in another tab.

**Evidence:**

One reviewer was confused that the Projects tab depends on selections in the
Layers tab. Another could not confidently answer a bypass question because a
previous Feather filter remained active.

**Impact:**

Users may draw incorrect conclusions from a filtered subset.

**Affected area:**

Layer panel, Projects tab, filter state UI.

**Possible fix:**

Add active-filter chips or a compact summary visible from both tabs. Add a clear
all/reset control. Improve empty-state text when active filters hide projects.

**Priority:**

P1

**Labels:**

`usability`

## R1-11: Add select-all/deselect-all controls for layer groups

**Problem:**

Turning groups of layers or project types on/off one by one is inefficient.

**Evidence:**

Two reviewers requested select all/deselect all controls for data layer lists.

**Impact:**

This is a friction point during exploration and testing, especially as layer
count grows.

**Affected area:**

Layer panel.

**Possible fix:**

Add select-all/clear controls for project types and possibly context layer
groups.

**Priority:**

P2

**Labels:**

`usability`

## R1-12: Add zoom-to-boundary actions

**Problem:**

Users can toggle boundary layers but cannot quickly navigate to a boundary from
the layer control.

**Evidence:**

One reviewer requested clicking a boundary layer to zoom into that boundary,
similar to project zoom actions in the Projects tab.

**Impact:**

Boundary layers are less useful as navigation aids.

**Affected area:**

Layer panel, map fit-bounds utilities.

**Possible fix:**

Add zoom-to controls for watershed, Delta, and bypass boundaries.

**Priority:**

P2

**Labels:**

`feature-request`, `usability`

## R1-13: Reformat acreage in compact project-list rows

**Problem:**

Exact decimal acreage in small list text can be misread as thousands separators.

**Evidence:**

One reviewer initially read `58.427` acres as `58,427` acres in the filter/list
view.

**Impact:**

Users may misunderstand project scale while browsing.

**Affected area:**

Projects tab list rows, detail panel number formatting.

**Possible fix:**

Round acreage to whole integers throughout the dashboard, unless the overall 
value is less than one; in that case, use a single decimal digit.

**Priority:**

P1

**Labels:**

`content`, `usability`

## R1-14: Decide public contact and more-information policy

**Problem:**

Users want contacts or a place to learn more about individual projects, but
contact fields are not currently approved for public display.

**Evidence:**

Reviewers asked who to contact for more information, requested point-of-contact
details, and looked for locations outside the map where project information
could be found.

**Impact:**

The map may help users find projects but not support follow-up.

**Affected area:**

Project detail panel, data model, governance/policy, methodology.

**Possible fix:**

Decide whether to display public project websites, lead-entity pages, a generic
program contact, or approved public contacts. Do not expose operational contact
fields until approved.

**Priority:**

P2

**Labels:**

`content`, `methodology`, `feature-request`

## R1-15: Track project-document links as future scope

**Problem:**

Users want access to project designs, CEQA documents, monitoring plans, annual
reports, limiting-factors analyses, and other supporting materials.

**Evidence:**

Multiple reviewers requested PDFs, project websites, source materials, or links
to planning/science documents.

**Impact:**

Document links would improve credibility and deeper review, but could expand
the dashboard into document management if not scoped carefully.

**Affected area:**

Project detail panel, methodology, future data contract.

**Possible fix:**

Support optional external public URLs when stable and approved in a version 2.0.
Defer any document repository or file-hosting workflow.

**Priority:**

P3

**Labels:**

`feature-request`, `methodology`, `content`

## R1-16: Standardize project data submission guidance for future rounds

**Problem:**

The map exposes inconsistencies in submitted project data, especially acreage by
type, accounting category, design-criteria acreage, target life stages, and
construction/status information.

**Evidence:**

Reviewers requested standardized proponent guidance, habitat commitment
categories, life stages/runs, acreage by habitat type, and clearer construction
information.

**Impact:**

Dashboard fixes alone cannot produce trustworthy canonical data if the upstream
submission contract remains ambiguous.

**Affected area:**

Schema, conversion script, data governance, future submission guidance.

**Possible fix:**

Create data-submission guidance tied to the LinkML schema and future canonical
record contract. Align frontend definitions, inline help, and methodology/data
dictionary copy with that upstream guidance. Track missing fields separately
from frontend display issues.

**Priority:**

P1 for data governance; P3 for frontend-only implementation

**Labels:**

`data-quality`, `methodology`

## R1-17: Define small-screen and accessibility support target

**Problem:**

The current feedback round primarily validates desktop use by expert reviewers.
The dashboard now defines phone-sized screens as unsupported for interactive map
exploration because the map, layer rail, project browsing, and project polygons
are information-dense. Tablet and desktop remain the supported interactive
surfaces.

**Evidence:**

One reviewer explicitly suggested testing mobile. Public users may open shared
links on phones, even if deeper map exploration is intended for larger screens.
`AGENTS.md` and `SPEC.md` already note that broader keyboard/screen-reader audit
coverage is still needed.

**Impact:**

Without an explicit boundary, the product could over-invest in a compromised
phone-sized GIS experience or leave phone visitors at a dead end. Accessibility
remains a v1 requirement on supported surfaces, and the phone notice and its
informational actions must be accessible.

**Affected area:**

Phone unsupported-surface notice and informational actions; keyboard navigation,
screen-reader labels, Projects tab, detail panel, layer controls,
About/methodology access on tablet and desktop.

**Possible fix:**

Implement an accessible phone-sized unsupported-surface notice that preserves
purpose, methodology, contact, and data-download actions; retain shared-link
URLs and explain that a tablet or desktop is required. Do not build a mobile map
experience. Separately run keyboard and screen-reader checks on supported
tablet/desktop critical paths including load, orientation, project-list browsing,
filter reset, project selection, detail panel, download data, and inline-help
popovers.

**Priority:**

P1

**Labels:**

`accessibility`, `usability`, `testing`

## R1-18: Defer science/monitoring/adaptive-management views

**Problem:**

Reviewers suggested effectiveness monitoring, biological utilization,
project-specific science plans, TAC membership, HRL hypotheses, flow
contributions, and related science/planning content.

**Evidence:**

These requests appeared in general feedback and trust-related comments.

**Impact:**

These features could make the dashboard more valuable later, but they exceed the
current map-first communication scope.

**Affected area:**

Future product roadmap, data infrastructure, methodology.

**Possible fix:**

Track as future science/monitoring roadmap items. Keep v1 focused on locations,
basic descriptions, clear provenance, and trustworthy acreage/status language.

**Priority:**

P3

**Labels:**

`feature-request`, `methodology`

## R1-19: Evaluate additional thematic context layers

**Problem:**

Some users want additional geographic context beyond current watershed, boundary,
stream, and basemap layers.

**Evidence:**

One reviewer suggested EPA ecoregions. Others requested more tributary
boundaries, which is covered separately because it was a repeated need.

**Impact:**

Additional layers could help interpretation but may also distract from the
project overview.

**Affected area:**

Layer catalog, map cartography.

**Possible fix:**

Evaluate through a future layer-catalog sub-spec. Add only layers with clear
audience value and understandable labels.

**Priority:**

P3

**Labels:**

`cartography`, `feature-request`

## R1-20: Consider Bay-Delta Update / Plan of Implementation context

**Problem:**

The dashboard may not clearly connect HRL restoration projects to the Bay-Delta
Water Quality Control Plan Update / Plan of Implementation context.

**Evidence:**

One reviewer noted there was no mention of the Bay Delta Update or
acknowledgment that HRL will become the Plan of Implementation for the Update.

**Impact:**

Users may miss why the project portfolio matters institutionally.

**Affected area:**

About popup, first-run orientation, methodology, public copy review.

**Possible fix:**

Add approved framing language if appropriate for the public/regulator audience.
Confirm terminology before implementation.

**Priority:**

P2

**Labels:**

`content`, `methodology`
