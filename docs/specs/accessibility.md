# Accessibility sub-specification

**Status:** Adopted roadmap; audit incomplete  
**Parent:** [`SPEC.md`](../../SPEC.md), Sections 3, 13, and 16

## Conformance target

The dashboard targets WCAG 2.2 Level AA, with selected AAA criteria where applicable. Essential information and workflows cannot depend on map reading, pointer use, hover, color, or animation alone.

## Current equivalent paths

- Projects tab: searchable and filterable project records.
- List-driven selection, zoom-to-project, and fit-to-visible-projects actions.
- Detail panel with textual project attributes.
- Headline summary values and downloadable GeoJSON, GeoPackage, and CSV data.

## Required v1 hardening

1. Audit keyboard order, focus visibility, focus restoration, Escape behavior, and mobile panel behavior.
2. Audit names, roles, states, and live updates with screen-reader testing.
3. Verify the non-map workflow can find, filter, inspect, and download every essential project record without interpreting the map.
4. Test color contrast and non-color cues in map, controls, badges, tooltips, selection, and basemap modes.
5. Test zoom, reflow, reduced motion, touch target size, and error-free operation at supported breakpoints.

Document audit findings, owners, severity, and remediation status before declaring accessibility complete. Product-level requirements and any settled policy changes remain in `SPEC.md` and its Decision Log.
