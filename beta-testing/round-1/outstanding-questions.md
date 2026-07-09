# Outstanding Questions for Colleagues

This is a working list of questions to resolve after the first round of
beta-testing feedback. Add notes under each question as answers come in, then
promote settled answers into `SPEC.md`, methodology content, data guidance, or implementation issues as appropriate.

## Acreage Definition and Display

**Question:** How should the dashboard characterize project acreage in public
UI labels and methodology text?

**Context:** The vendored schema title for `acreage` is "Total project acreage"
and its description is "Total project acreage restored as habitat." The schema
also says each acre should be counted once, even if it provides different
habitat types at different times of year or flow rates. Round 1 reviewers asked
whether acreage means project footprint, habitat-accounting credit, acreage
meeting design criteria, submitted acreage, or verified outcome acreage.

**Decision needed:** Confirm whether public labels should use "total project
acres," "submitted project acres," "habitat acres," or another term, and define
the short caveat that belongs in the dashboard versus the fuller methodology
page.

## Habitat-Specific Acreage

**Question:** Should habitat-specific acreage fields be shown as accounting
acreage, anticipated accounting acreage, submitted estimates, or something
else?

**Context:** The schema comments for habitat-specific acreage fields say they
"should be the acreage anticipated to be verified through the HRL accounting
process." That wording is more technical than we want in the project detail
panel, but it matters for methodology and download documentation.

**Decision needed:** Confirm the display label, caveat, and whether any records
need a data-quality flag when total acreage and habitat-specific acreage differ.

## Project Stage and Status

**Question:** How should multivalued project-stage submissions be summarized for
public display?

**Context:** Reviewers were unsure whether values such as "construction" refer
to current status, construction start, completion, or a submitted phase category.
Some records have multiple stage values.

**Decision needed:** Confirm public labels and definitions for stage/status, and
whether the UI should show a summarized status while preserving submitted values
in downloads.

## Data Source and Update Language

**Question:** What source, version, and update-date language can the prototype
display before the production data pipeline exists?

**Context:** Reviewers asked where project facts came from, when they were
updated, and how submitted data were standardized. The current prototype uses a
local GeoPackage converted into static files, not an Azure-published canonical
snapshot.

**Decision needed:** Confirm the public provenance language for the About popup,
methodology page, project detail panel, and data downloads.

## Public Contact and More-Information Links

**Question:** Should project detail panels include public contact information or
links to more information?

**Context:** Reviewers asked for contact information and source materials, but
the schema contact fields may identify internal program contacts and may not
be appropriate for public display.

**Decision needed:** Confirm whether to show no contact, a generic program
contact, lead-entity public pages, project-specific public pages, or another
approved pattern.

## Boundary and Tributary Context

**Question:** Which watershed, tributary, or administrative boundaries should be
included in v1?

**Context:** Round 1 reviewers expected boundaries for additional HRL
tributaries, and some were confused by the current mix of Sacramento, Mokelumne,
Tuolumne, Delta, and bypass context layers.

**Decision needed:** Confirm the v1 boundary layer catalog, source datasets,
default visibility, and explanatory labels.
