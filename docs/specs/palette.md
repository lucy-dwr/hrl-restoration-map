# Palette sub-specification

**Status:** Adopted for the current prototype  
**Parent:** [`SPEC.md`](../../SPEC.md), Sections 6 and 16

This document records the palette contract currently implemented in the dashboard. It inherits the umbrella specification and does not settle the pending formal multi-agency production identity decision.

## Principles

- Project types must be distinguishable at normal map zooms and must not rely on color alone: the detail panel, labels, and filters expose type names.
- Hydrography is contextual, not project data; reserve blue-gray styling for it.
- Selection is communicated with a high-contrast halo, not only a color shift.
- Text and controls must meet the WCAG target in the umbrella specification.

## Implemented tokens

| Use | Value |
|---|---|
| Primary text | `#102f34` |
| Secondary text | `#40575a` |
| Tertiary text | `#64746f` |
| Primary accent | `#00504b` |
| Accent hover | `#023036` |
| Warm contextual accent | `#b07812` |
| Base surfaces | `#ffffff`, `#f7f8f4`, `#eef2e8` |
| Selected-project contrast / halo | `#102f34` / `#ffffff` |

The canonical UI token definitions are in [`src/styles/tokens.css`](../../src/styles/tokens.css). Decision 23 establishes the minimum contrast requirement for tertiary text; do not lower it without a superseding decision.

## Project-type colors

| Project type | Hex |
|---|---|
| Bypass floodplain habitat | `#8c510a` |
| Fish food production | `#bf9b00` |
| Fish passage improvement | `#d95f02` |
| Fish screen installation or improvement | `#6a3d9a` |
| Rearing habitat | `#c51b7d` |
| Spawning habitat | `#b2182b` |
| Tidal habitat | `#018571` |
| Tributary floodplain habitat | `#4d9221` |
| Other and fallback | `#737373` |

The executable source of this mapping is [`src/features/map/project-colors.ts`](../../src/features/map/project-colors.ts). Changes must keep every `ProjectTypeEnum` value mapped and verify both normal and color-vision-deficiency simulations against the actual map treatment.

## Change control

Before changing a color, test it in the map alongside stream layers, boundary layers, selection, hover, and both basemap modes. Record a Decision Log entry in `SPEC.md` when the change alters a settled visual policy.
