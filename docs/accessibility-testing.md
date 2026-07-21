# Accessibility testing

This project targets WCAG 2.2 Level AA. Automated tests help prevent detectable
regressions, but an automated pass is not a conformance determination or legal
compliance certification.

## Automated checks

Install the browser once after installing dependencies:

```sh
pnpm exec playwright install chromium
```

Run the suite locally:

```sh
pnpm run test:a11y
```

The suite uses [Playwright](https://playwright.dev/) and
[axe-core](https://github.com/dequelabs/axe-core) with WCAG 2.0, 2.1, and 2.2
Level A and AA tags. It exercises the initial dashboard, About dialog, Layers controls,
Projects search and detail state, data-download menu, and a 768px-wide supported
viewport. GitHub Actions runs the same suite on pull requests to `main` and
pushes to `main`. Failed runs retain the Playwright report, screenshots, and
traces.

Do not add broad axe exclusions or a permitted violation count. If a temporary
exception is necessary, document the affected component and rule, why it is
temporary, its follow-up issue, and the condition or date for removal. Scope it
to the smallest affected test or element.

## Manual review checklist

Perform this review for substantial user-interface changes, and record findings,
owner, severity, and remediation status in the related issue or pull request.

A thorough, non-exhaustive VoiceOver audit has been completed. Revisit its
critical paths when related interface changes are made, and use the checklist
below to complete the remaining manual coverage.

### Keyboard operation

- Complete the primary workflows without a mouse: browse, filter, inspect, and
  download project data.
- Confirm logical focus order, visible focus, and no keyboard trap.
- Confirm Escape closes menus and dialogs and returns focus to the opener.
- Confirm map-specific keyboard behavior is usable and documented.

### Screen-reader behavior

- Recheck VoiceOver with Safari on macOS for substantial changes to audited
  workflows; add NVDA testing on Windows before production release.
- Confirm landmarks, headings, names, roles, values, and state changes are
  understandable.
- Confirm dialogs announce their names and manage focus correctly.
- Confirm project selection and filtering changes are communicated clearly.

### Equivalent non-map access

- Search and browse projects in the Projects tab.
- Apply filters, open a project, and read its textual details without using the
  map.
- Review headline metrics and download the underlying data.

### Visual and responsive review

- Check text, control, and focus-indicator contrast and non-color cues.
- Check 200% browser zoom, reflow at supported tablet widths, and overlap of
  panels and dialogs.
- Check reduced motion and forced-colors/high-contrast behavior where feasible.

### Content quality

- Confirm accessible names, alternative text, links, empty states, and errors
  are meaningful.
- Confirm instructions do not rely only on color, shape, position, or other
  sensory characteristics.

## Baseline evidence

Prior to accessibility testing, an external automated scan of the deployed v0.2
Azure Static Web App reported a 94% automated accessibility score, WCAG 2.0/2.1/2.2
AA automated passes, and no associated Section 508 automated failures. This is
informational baseline evidence only; it does not verify keyboard behavior,
screen-reader output, meaningful labels, map-equivalent access, or complete WCAG
conformance.
