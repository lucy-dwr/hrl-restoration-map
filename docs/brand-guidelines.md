# Healthy Rivers and Landscapes Brand Assets

## Visual character

The visual character is calm, credible, and grounded in California rivers and landscapes: warm pale surfaces, deep teal emphasis, restrained olive and gold context accents, and blue-grey water features. Use ample white space and clear hierarchy. In maps, project data may be more saturated than the basemap; in presentations, reserve stronger color for the central message, key numbers, and calls to action.

## Core palette

| Role | Color | Hex | Use |
| --- | --- | --- | --- |
| Primary accent | Deep teal | `#00504B` | Headings, key rules, calls to action, and primary emphasis |
| Dark accent | Dark teal | `#023036` | Darker emphasis and high-contrast backgrounds |
| Warm accent | Olive gold | `#B07812` | Secondary contextual emphasis |
| Surface 0 | White | `#FFFFFF` | Primary page and slide background |
| Surface 1 | Warm off-white | `#F7F8F4` | Secondary backgrounds |
| Surface 2 | Pale sage | `#EEF2E8` | Subtle fills and grouping |
| Primary text | Deep blue-teal | `#102F34` | Headings and primary body text |
| Secondary text | Blue-grey | `#40575A` | Supporting text and map labels |
| Tertiary text | Muted green-grey | `#64746F` | De-emphasized labels and metadata |
| Subtle border | Deep teal, 8% | `rgba(2, 48, 54, 0.08)` | Low-emphasis separation |
| Standard border | Deep teal, 16% | `rgba(2, 48, 54, 0.16)` | Controls and stronger separation |

Use the translucent accent fills `rgba(0, 80, 75, 0.10)` and `rgba(231, 165, 61, 0.16)` for soft emphasis or contextual states. Maintain sufficient text contrast.

## Project-type map palette

These colors encode the project’s primary type on the map. Keep the labels, legend, and other non-color cues visible: color must not be the only way to communicate a project type.

| Project type | Color | Hex |
| --- | --- | --- |
| Bypass floodplain habitat | Umber | `#8C510A` |
| Fish food production | Mustard | `#BF9B00` |
| Fish passage improvement | Orange | `#D95F02` |
| Fish screen installation or improvement | Purple | `#6A3D9A` |
| Rearing habitat | Magenta | `#C51B7D` |
| Spawning habitat | Crimson | `#B2182B` |
| Tidal habitat | Green-teal | `#018571` |
| Tributary floodplain habitat | Green | `#4D9221` |
| Other / fallback | Gray | `#737373` |

The palette is hue-separated and was screened for deuteranopia and protanopia. Do not repurpose its blue-green colors for hydrography; water is deliberately quieter than project data.

## Map and reference palette

| Feature | Color | Hex |
| --- | --- | --- |
| Map background | Warm pale | `#FBFBF5` |
| Water fill | Pale blue-green | `#E8F3F2` |
| Waterway line | Blue-grey | `#B8D7D5` |
| Stream network | Blue-grey teal | `#5F9FAA` |
| Major water fill | Pale aqua | `#CFE4E5` |
| Boundary emphasis | Deep teal | `#00504B` |
| Secondary boundary emphasis | Golden orange | `#D6901A` |
| Tertiary boundary emphasis | Olive | `#8E8934` |
| Selection contrast | Deep blue-teal | `#102F34` |
| Selection halo | White | `#FFFFFF` |

Basemap land, roads, buildings, and labels should remain muted so project footprints and markers are the strongest colors on the map. On imagery, keep overlay labels readable with a light label and dark halo treatment.

## Typography

Use a clear sans-serif typeface consistently across a deck or document. A reliable working choice is the system UI sans-serif stack:

```css
system-ui, -apple-system, 'Segoe UI', sans-serif
```

No final HRL brand typeface has been selected. For working materials, use the recipient platform’s system sans-serif. Do not present Inter, IBM Plex Sans, or Source Sans 3 as an approved HRL font.

| Size | Typical use |
| --- | ---: |
| 11–12px | Fine metadata and compact labels |
| 14–15px | Default body text |
| 18px | Section headings |
| 22px and above | Major headings and slide titles |

Use weights 400 (regular), 500 (medium), 600 (semibold), and 700 (bold). Favor sentence case for interface labels and headings.

## Slide and document guidance

Favor an uncluttered, editorial layout with one clear idea per slide. Use the core palette as the default for presentation backgrounds, text, dividers, tables, and charts; reserve the project-type map palette for maps, legends, and project-category charts.

- Use white or warm off-white (`#F7F8F4`) as the primary background; use deep teal sparingly for title or closing slides.
- Set body text in deep blue-teal (`#102F34`) and supporting text in blue-grey (`#40575A`).
- Use deep teal (`#00504B`) for key headings, rules, and emphasis. Use olive gold (`#B07812`) as a secondary accent, not as the default text color.
- Use one project-type color per category consistently wherever a map or chart uses those categories; always include direct labels or a legend.
- Keep tables simple: light fills, restrained borders, and no more than one accent color unless colors encode categories.
- Use photographs or maps with room for legible captions; confirm image rights before external publication.
- Use one consistent open-source icon family where icons are needed. Lucide or Phosphor are recommended candidates; no final set is recorded.

## Accessibility requirements

- Aim for WCAG 2.2 AA contrast and readability in digital materials; selected AAA criteria are encouraged for contrast, instructions, help, and cognitive accessibility.
- Do not convey essential information through color alone; label maps, charts, and diagrams directly or provide a clear legend.
- Use large, legible type and leave sufficient space around text and graphics.
- Avoid dense tables, decorative text over photography, and animations that distract from the message.
- Provide accessible source material or an equivalent text description for complex maps, charts, and diagrams when sharing digitally.
