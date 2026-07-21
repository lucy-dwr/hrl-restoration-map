# Accessibility sub-specification

**Status:** Automated regression coverage established; manual audit in progress
**Parent:** [`SPEC.md`](../../SPEC.md), Sections 3, 13, and 16

## Conformance target

The dashboard targets WCAG 2.2 Level AA, with selected AAA criteria where applicable. Essential information and workflows cannot depend on map reading, pointer use, hover, color, or animation alone.

## Supported surfaces

Interactive dashboard use is supported on tablet and desktop. Phone-sized screens
are not a supported surface for map exploration, layer controls, filters, project
browsing, or detail inspection. They must instead receive a clear, accessible
notice that a larger screen is required and retain access to purpose,
methodology, contact, and data-download actions. Shared links must remain intact
and explain the unsupported display rather than fail silently.

## Current equivalent paths

- Projects tab: searchable and filterable project records.
- List-driven selection, zoom-to-project, and fit-to-visible-projects actions.
- Detail panel with textual project attributes.
- Headline summary values and downloadable GeoJSON, GeoPackage, and CSV data.

## Automated regression testing

Automated WCAG 2.2 Level A and AA regression checks are established with
Playwright and axe-core. The suite covers representative initial, dialog,
layer control, project detail, download menu, and supported narrow viewport
states. It runs locally with `pnpm run test:a11y` and in GitHub Actions for pull
requests to `main` and pushes to `main`.

See [accessibility testing](../accessibility-testing.md) for setup, test scope,
temporary exception requirements, baseline evidence, and the manual review
checklist. An automated pass indicates that the configured tests found no
detectable violations in their tested states; it is not a complete conformance
determination.

## Current audit progress

- Automated checks cover representative initial, dialog, layer-control,
  project-detail, download-menu, and supported narrow-viewport states.
- A thorough, non-exhaustive VoiceOver audit has been completed. Its findings
  inform ongoing remediation; it does not replace broader assistive-technology
  and keyboard review.
- The Projects tab, textual detail panel, headline metrics, and data downloads
  provide the implemented non-map route to essential project information.

## Remaining v1 hardening

1. Complete a manual keyboard review of focus order, visibility, restoration,
   and Escape behavior on supported tablet and desktop breakpoints; verify the
   phone unsupported-surface notice and its informational actions.
2. Expand assistive-technology coverage beyond the completed VoiceOver audit,
   including NVDA testing on Windows before production release, and verify
   names, roles, states, and live updates in the remaining critical paths.
3. Complete a manual end-to-end review of the non-map workflow for finding,
   filtering, inspecting, and downloading essential project records.
4. Manually review contrast and non-color cues in map layers, controls, badges,
   tooltips, selection, and basemap modes.
5. Complete manual 200% zoom, reduced-motion, forced-colors where feasible,
   touch-target, and supported tablet/desktop reflow checks.

Document audit findings, owners, severity, and remediation status before declaring accessibility complete. Product-level requirements and any settled policy changes remain in `SPEC.md` and its Decision Log.
