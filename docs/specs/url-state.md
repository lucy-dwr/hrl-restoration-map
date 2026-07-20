# URL state sub-specification

**Status:** Adopted for the current prototype  
**Parent:** [`SPEC.md`](../../SPEC.md), Sections 8 and 16

The URL is the shareable map-view contract. The implementation is [`src/lib/url-state.ts`](../../src/lib/url-state.ts); this document describes the public behavior that implementation must preserve.

## Current parameters

| Parameter | Meaning | Default when absent |
|---|---|---|
| `lat`, `lng`, `zoom` | Map view, serialized to 4, 4, and 2 decimal places | `38.4`, `-121.8`, `7` |
| `basemap=imagery` | Select imagery basemap | Map basemap |
| `selected=<display_id>` | Selected project | No selection |
| `hidden=a,b` | Comma-separated hidden project type keys | All project types visible |
| `visibleTributaries=a,b` | Comma-separated visible tributary keys | No tributary boundaries visible |
| `delta=1` | Show Delta legal boundary | Hidden |
| `yolobypass=1` | Show Yolo Bypass boundary | Hidden |
| `sutterbypass=1` | Show Sutter Bypass boundary | Hidden |
| `streams=0` | Hide stream network | Stream network visible |

Valid tributary keys are `sacramento`, `american`, `feather`, `yuba`, `putah`, `mokelumne`, and `tuolumne`.

## Serialization rules

- Use plain, human-readable query parameters; do not introduce encoded blobs without a superseding decision.
- Preserve unrelated query parameters when writing dashboard state.
- Omit a parameter when its value is the documented default.
- Update state with `history.replaceState`; routine map interaction must not create a browser-history entry for every movement.
- Invalid numeric view values fall back independently to their defaults.

## Compatibility

Older shared prototype URLs using `hiddenTributaries` remain readable. The legacy `sacramento=0`, `mokelumne=0`, and `tuolumne=0` flags are also read, but current writes use only `visibleTributaries`.

## Deliberate gap

Project-list search, system filtering, and early-implementation filtering are currently local UI state. Encoding them is v1 hardening work; define stable keys and test URL round trips before adding them.
