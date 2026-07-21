# Round 1 Beta Feedback Synthesis

**Source feedback:** `hrl-restoration-map-prototype-feedback-round-1.csv`  
**Survey protocol:** `round-1-beta-testing.md`  
**Responses reviewed:** 7  
**Issue status:** No GitHub issues opened from this triage.

## Summary

Round 1 feedback suggests the prototype is directionally successful as a
map-first overview of HRL restoration projects. Reviewers were able to navigate
to familiar places, inspect project records, use filters, and understand the
basic relationship between project polygons, project types, and project details.
Four of seven reviewers said they would use the map again as-is, and the other
three said maybe with changes.

The main blocker is not basic usability. The main blocker is trust and
interpretation: reviewers need clearer explanation of what the map is for, what
the acreage numbers represent, how project stages/status should be read, where
the data came from, when they were updated, and what geographic/project context
is intentionally incomplete versus missing.

That distinction matters for scope. Several requests point toward a richer
internal accounting, project-management, and science/monitoring tool. The
current spec defines the dashboard as a public/regulator-facing overview and
communication surface, not an analyst workbench. The strongest near-term changes
should therefore improve clarity, trust, and orientation without turning the
prototype into the full HRL data system.

## Respondent Context

All respondents were already at least moderately familiar with HRL restoration
projects:

| Familiarity | Count |
|---|---:|
| Very familiar | 3 |
| Moderately familiar | 4 |
| Not very familiar | 0 |

Agencies/perspectives represented included the State Water Resources Control
Board, DWR/DFPI, Water Forum, CDFW, and Yuba Water Agency.

Because no truly public or low-context users responded, this round is strongest
as an expert-stakeholder review. It should not be treated as evidence that the
first-run public experience is self-explanatory.

## What Works

### Navigation and finding familiar places

All seven reviewers completed the familiar-area task and rated it easy. Several
reviewers found the map intuitive on desktop, either by direct map navigation,
the Projects tab, or the system filter.

What this validates:

- The map-first layout is usable for technically literate reviewers.
- The current basemap is simple enough to support project exploration.
- The Projects tab and filters provide a useful non-map entry point.

### Project list, search, and filters

All seven reviewers completed the browse/filter task. Six of seven said the
relationship between the project list, filters, and map was clear, and six of
seven said filters behaved as expected.

What this validates:

- The coordinated Projects tab is worth keeping.
- Search and system/early-implementation filters are useful.
- A list-based browsing path is important even for users who can use the map.

### Project polygons and project types

Reviewers repeatedly identified project polygons, project types, project counts,
and acreage summaries as the most useful parts of the map. These are the core
ambient/browsing features described in the spec, and the feedback supports
continuing to invest in them.

### Visual design and overall interface

Reviewers described the interface as easy to navigate, comprehensive, visually
strong, and a good base tool. Visual polish appears to increase confidence, but
only when the underlying terms and data meanings are also clear.

## What Should Change Before Broader Sharing

### 1. Explain what the dashboard is for on first load

The first impression was mixed:

| Purpose clarity | Count |
|---|---:|
| Very clear | 3 |
| Somewhat clear | 3 |
| Not clear | 1 |

Several reviewers understood the intended audience as public, SWRCB, agencies,
or interested parties. Others read it as an internal/interagency tracking tool
or an accounting tool. One reviewer explicitly said the map lacked context and
would serve HRL insiders more than public viewers.

Recommended change:

- Add a first-run orientation overlay or persistent compact introduction,
  consistent with `SPEC.md` Section 12.
- Make the About affordance more discoverable and less icon-only.
- State plainly that the current map shows submitted/proposed HRL restoration
  project locations and basic descriptions, not verified accounting outcomes.
- Include Bay-Delta Water Quality Control Plan / Bay-Delta Update context if
  approved for public-facing copy.

### 2. Define acreage before users infer accounting meaning

Acreage was the strongest trust issue. Reviewers asked whether acreage means
project footprint, habitat-accounting credit, acreage meeting design criteria,
acres by habitat type, or some other accounting basis. One reviewer flagged the
Tisdale Weir Reoperation acreage as visually inconsistent with the mapped
footprint. Another confused `58.427` with `58,427` in the project list because
the list shows exact decimals at small size.

Recommended change:

- Add explicit labels and help text for total submitted acreage.
- Distinguish project footprint acreage from HRL habitat commitment/accounting
  acreage where the data support it.
- Round acreage in compact list contexts and reserve precise acreage for detail
  views or data downloads.
- Add a data-quality note for projects whose acreage basis is known to need
  review.

### 3. Add source, update, and methodology context

Reviewers asked for source materials, the year or basis of budget figures, the
source of target species, data update timing, and links to supporting project
materials. Lack of source materials was explicitly listed as reducing
confidence.

Recommended change:

- Prioritize the full methodology page already listed as a v1 requirement.
- In the detail panel, expose lightweight data provenance such as source dataset
  version/date when available.
- In About/methodology, describe how submitted project data were standardized
  and what fields are not yet canonical.
- Avoid displaying sensitive/internal fields unless a public policy exists.

### 4. Clarify project status and phase display

Reviewers found current stage/phase presentation ambiguous. Examples included
uncertainty about whether "construction" means construction start, completion,
or current status, and confusion when combined values appeared near the top of
the detail panel without clear labels.

Recommended change:

- Use an explicit "Status" or "Stage" section in project detail.
- Define status/stage terms in methodology or inline help.
- Consider a display summary for multivalued stage data, while preserving the
  original submitted values in downloads.

### 5. Improve geographic context for individual tributaries

Multiple reviewers expected boundaries for individual HRL tributaries such as
Feather, Yuba, American, Putah, and other project-area watersheds. Existing
Sacramento, Mokelumne, and Tuolumne boundaries were useful to some reviewers
but confusing or incomplete to others. One reviewer also noted that the
Sacramento watershed boundary color is too similar to the stream network.

Recommended change:

- Add a layer-catalog decision about which tributary/watershed boundaries belong
  in v1.
- Adjust watershed symbology so boundaries are clearly distinct from streams.
- Label existing watershed layers so users understand why only some are present.
- Consider boundary zoom-to actions.

### 6. Make selected and small projects easier to see

Reviewers found small projects hard to see at default scale, and one reviewer
had trouble distinguishing overlapping Feather River projects because selection
was shown mainly through a thicker outline in the same color.

Recommended change:

- Strengthen selected-feature styling.
- Consider point/centroid or cluster-style summary markers at low zoom while
  preserving polygon inspection at closer zooms.
- Provide a visible "fit to visible projects" or region summary affordance for
  users starting from the default extent.

### 7. Revisit filter semantics for multivalued project types

One reviewer flagged that projects can have multiple assigned categories but
appear to be filtered/styled by only the first category. This conflicts with
the data model reality that `project_type` is multivalued.

Recommended change:

- Confirm current behavior in code and data.
- If filters use only primary type, label that explicitly.
- Prefer filters that match any assigned project type while symbology continues
  to use a documented primary type.

### 8. Reduce confusion between Layers and Projects filters

Reviewers noticed that Projects tab results depend on project-type visibility in
the Layers tab. This coordination is consistent with the spec, but it was not
always obvious when a prior filter or hidden layer constrained later answers.

Recommended change:

- Add active-filter summaries and clear/reset controls.
- Make cross-tab filtering state visible from both tabs.
- Consider warning/empty-state copy when no projects appear because another
  tab's filter is active.

## What Should Be Deferred or Handled Outside the Prototype

### Full accounting and design-criteria verification

Several reviewers want habitat acres meeting design criteria, HRL habitat
commitment categories, flow contributions, acreage by habitat type, and
standardized proponent guidance. These are important, but they depend on data
governance and canonical accounting definitions beyond the current prototype. 
They may also be out-of-scope for this product and belong in a separate pane or
application.

Recommended disposition: defer dashboard implementation until the data contract
exists and public-facing information needs are better established; track as
data-model and methodology requirements.

### Project document repository

Reviewers requested links or downloads for CEQA documents, designs, monitoring
plans, annual reports, limiting-factors analyses, science plans, and similar
materials.

Recommended disposition: support external links when stable public URLs are
available, but do not build a document-management system into the dashboard.

### Individual points of contact

Reviewers requested project contacts. `SPEC.md` currently marks contact fields
as not publicly displayed without explicit approval.

Recommended disposition: decide a public-contact policy before implementing.
An alternative is a generic program contact or project website link.

### Science, monitoring, and adaptive-management views

Reviewers suggested effectiveness monitoring, biological utilization, project
science plans, TAC membership, hypotheses, and other science-planning context.

Recommended disposition: align with the spec's potential future science and
monitoring views. Do not block the v1 communication dashboard on these features.

### Additional thematic context layers

EPA ecoregions and other physiographic/context layers may be useful but should
be evaluated through a layer-catalog process. They are not required to fix the
main Round 1 trust issues.

## Recommended Priority Order

1. Clarify acreage meaning and accounting limitations.
2. Add first-run orientation and improve About/methodology discoverability.
3. Add source/update/methodology documentation.
4. Clarify project status/stage labels.
5. Improve selected-feature visibility and low-zoom project discoverability.
6. Add or explicitly scope tributary/watershed boundary context.
7. Fix/clarify multivalued project-type filtering.
8. Add active-filter summaries and reset controls.
9. Implement and test the phone unsupported-surface notice, then perform the
   tablet/desktop accessibility audit before declaring v1 accessibility complete.
10. Defer deeper accounting, monitoring, document repository, and internal
    project-management features until data governance and product scope support
    them.

## Implications for `SPEC.md`

Round 1 supports several existing spec decisions:

- Map-first, full-bleed layout remains appropriate.
- The Projects tab/non-map equivalent is valuable and should stay.
- The dashboard should not become an analyst exploration environment.
- The full methodology page is a real v1 requirement, not polish.
- The first-run orientation overlay should be treated as a near-term need.

Potential spec updates to consider:

- Add a decision that prototype acreage must be labeled as submitted/project
  acreage unless and until canonical habitat-accounting acreage exists.
- Add a decision or open question for tributary/watershed boundary scope.
- Add a sub-spec task for project status/stage display and definitions.
- Expand the layer-catalog sub-spec to include data source/update language and
  user-facing layer descriptions.
- Add public-contact/document-link policy questions to the open questions list.
