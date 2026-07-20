# Palette and branding sub-specification

**Status:** Adopted for the current prototype  
**Parent:** [`SPEC.md`](../../SPEC.md), Sections 6 and 16

This document is the shared palette, brand asset, and presentation guidance contract for the dashboard and related HRL materials. It inherits the umbrella specification and does not settle the pending formal multi-agency production identity decision.

## Visual character

The visual character is calm, credible, and grounded in California rivers and landscapes: warm pale surfaces, deep teal emphasis, restrained olive and gold context accents, and blue-gray water features. Use ample white space and clear hierarchy. In maps, project data may be more saturated than the basemap; in presentations, reserve stronger color for the central message, key numbers, and calls to action.

## Logo use

The dashboard header uses `public/hrl-logo-mark.png`, the 300 × 300 transparent favicon mark published on the [Healthy Rivers and Landscapes public water agencies program site](https://healthyriverslandscapes.org). Use this asset as supplied: do not crop, recolor, add a background plate, or place effects over it. Its transparent background is intended for use on the dashboard's light surfaces.

In the current dashboard header, the mark appears beside the full "Healthy Rivers and Landscapes Restoration Dashboard" name. Keep clear space around the mark and do not substitute it for the full program name in text.

## Principles

- Project types must be distinguishable at normal map zooms and must not rely on color alone: the detail panel, labels, filters, and legends expose type names.
- Hydrography is contextual, not project data; reserve blue-gray styling for it.
- Selection is communicated with a high-contrast halo, not only a color shift.
- Text and controls must meet the WCAG target in the umbrella specification.

## UI palette

| Role | Color | Value | Use |
|---|---|---|---|
| Primary accent | Deep teal | `#00504B` | Headings, key rules, calls to action, and primary emphasis |
| Dark accent | Dark teal | `#023036` | Darker emphasis and high-contrast backgrounds |
| Warm accent | Olive gold | `#B07812` | Secondary contextual emphasis |
| Surface 0 | White | `#FFFFFF` | Primary page and slide background |
| Surface 1 | Warm off-white | `#F7F8F4` | Secondary backgrounds |
| Surface 2 | Pale sage | `#EEF2E8` | Subtle fills and grouping |
| Primary text | Deep blue-teal | `#102F34` | Headings and primary body text |
| Secondary text | Blue-gray | `#40575A` | Supporting text and map labels |
| Tertiary text | Muted green-gray | `#64746F` | De-emphasized labels and metadata |
| Subtle border | Deep teal, 8% | `rgba(2, 48, 54, 0.08)` | Low-emphasis separation |
| Standard border | Deep teal, 16% | `rgba(2, 48, 54, 0.16)` | Controls and stronger separation |

Use `rgba(0, 80, 75, 0.10)` and `rgba(231, 165, 61, 0.16)` for soft accent and contextual fills. The canonical executable token definitions are in [`src/styles/tokens.css`](../../src/styles/tokens.css). Decision 23 establishes the minimum contrast requirement for tertiary text; do not lower it without a superseding decision.

## Project-type map palette

| Project type | Color | Hex |
|---|---|---|
| Bypass floodplain habitat | Umber | `#8C510A` |
| Fish food production | Mustard | `#BF9B00` |
| Fish passage improvement | Orange | `#D95F02` |
| Fish screen installation or improvement | Purple | `#6A3D9A` |
| Rearing habitat | Magenta | `#C51B7D` |
| Spawning habitat | Crimson | `#B2182B` |
| Tidal habitat | Green-teal | `#018571` |
| Tributary floodplain habitat | Green | `#4D9221` |
| Other / fallback | Gray | `#737373` |

The executable source of this mapping is [`src/features/map/project-colors.ts`](../../src/features/map/project-colors.ts). The palette is hue-separated and screened for deuteranopia and protanopia. Do not repurpose its blue-green colors for hydrography; water is deliberately quieter than project data.

## Map and reference palette

| Feature | Color | Hex |
|---|---|---|
| Map background | Warm pale | `#FBFBF5` |
| Water fill | Pale blue-green | `#E8F3F2` |
| Waterway line | Blue-gray | `#B8D7D5` |
| Stream network | Blue-gray teal | `#5F9FAA` |
| Major water fill | Pale aqua | `#CFE4E5` |
| Boundary emphasis | Deep teal | `#00504B` |
| Secondary boundary emphasis | Golden orange | `#D6901A` |
| Tertiary boundary emphasis | Olive | `#8E8934` |
| Selection contrast | Deep blue-teal | `#102F34` |
| Selection halo | White | `#FFFFFF` |

Basemap land, roads, buildings, and labels should remain muted so project footprints and markers are the strongest colors on the map. On imagery, keep overlay labels readable with a light label and dark halo treatment.

## Typography and iconography

Use a clear sans-serif typeface consistently across a deck or document. The current working choice is the system UI sans-serif stack:

```css
system-ui, -apple-system, 'Segoe UI', sans-serif
```

No final HRL brand typeface has been selected. For working materials, use the recipient platform's system sans-serif. Do not present Inter, IBM Plex Sans, or Source Sans 3 as an approved HRL font.

| Size | Typical use |
|---|---:|
| 11–12px | Fine metadata and compact labels |
| 14–15px | Default body text |
| 18px | Section headings |
| 22px and above | Major headings and slide titles |

Use weights 400 (regular), 500 (medium), 600 (semibold), and 700 (bold). Favor sentence case for interface labels and headings. Use one consistent open-source icon family where icons are needed; Lucide or Phosphor are recommended candidates, but no final set is recorded.

## Slide and document guidance

- Favor an uncluttered, editorial layout with one clear idea per slide.
- Use white or warm off-white (`#F7F8F4`) as the primary background; use deep teal sparingly for title or closing slides.
- Set body text in deep blue-teal (`#102F34`) and supporting text in blue-gray (`#40575A`). Use deep teal (`#00504B`) for key headings, rules, and emphasis, and olive gold (`#B07812`) as a secondary accent rather than default text color.
- Reserve the project-type palette for maps, legends, and project-category charts. Use one color per category consistently and always include direct labels or a legend.
- Keep tables simple: light fills, restrained borders, and no more than one accent color unless colors encode categories.
- Use photographs or maps with room for legible captions, and confirm image rights before external publication.

## Accessibility and change control

- Require WCAG 2.2 AA contrast and readability in digital materials; selected AAA criteria are encouraged for contrast, instructions, help, and cognitive accessibility.
- Do not convey essential information through color alone; label maps, charts, and diagrams directly or provide a clear legend.
- Use large, legible type and sufficient space around text and graphics. Avoid dense tables, decorative text over photography, and distracting animation.
- Provide accessible source material or an equivalent text description for complex maps, charts, and diagrams when sharing digitally.
- Before changing a color, test it in the map alongside stream layers, boundary layers, selection, hover, and both basemap modes. Record a Decision Log entry in `SPEC.md` when the change alters a settled visual policy.
