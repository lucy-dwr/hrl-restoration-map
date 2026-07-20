# Layer catalog sub-specification

**Status:** Adopted for the current prototype  
**Parent:** [`SPEC.md`](../../SPEC.md), Sections 7, 9.3, and 16

This catalog describes map layers exposed by the dashboard. It does not approve new reference layers; additions require product and source review.

| Logical layer | Source and format | Default | Purpose and treatment |
|---|---|---|---|
| Project locations | `public/data/hrl_restoration_projects.geojson` | Visible | Project footprints, with scale-dependent interior overview markers; styled by derived primary project type. |
| HRL tributary watersheds | USGS WBD output in `public/data/hrl-tributary-watersheds.geojson` | Hidden | Individual Sacramento, American, Feather, Yuba, Putah, Mokelumne, and Tuolumne boundary controls; no map labels. |
| Delta legal boundary | DWR `i03_LegalDeltaBoundary` output in `public/data/delta-boundary.geojson` | Hidden | Legal reference context, not an ambient map layer. |
| Yolo Bypass boundary | DWR `i12_Flood_Bypasses_2014` output in `public/data/yolo-bypass-boundary.geojson` | Hidden | Representational flood-bypass context. |
| Sutter Bypass boundary | DWR `i12_Flood_Bypasses_2014` output in `public/data/sutter-bypass-boundary.geojson` | Hidden | Representational flood-bypass context. |
| Stream network | NHDPlus V2 VPU 18 in `public/data/streams.pmtiles` | Visible | Zoom- and Strahler-order-dependent flowlines, waterbodies, and major-stream labels. |
| Terrain | AWS Terrarium DEM | Visible with map basemap | Restrained MapLibre hillshade context. |
| Map basemap | OpenFreeMap Positron with local overrides | Visible | Quiet default geographic context. |
| Imagery basemap | Esri World Imagery | Hidden | Optional inspection mode; subject to production-source review. |

## Layer rules

- Project type visibility is a filter over one logical project layer; it is not a set of separate source datasets.
- Boundary layers are reference context and must remain visually subordinate to project locations.
- Fixed layer order is intentional in v1; users cannot reorder layers.
- Generated local datasets must be reproducible through the scripts described in `AGENTS.md` and `SPEC.md`.

Map source and layer implementation is in [`src/features/map/Map.tsx`](../../src/features/map/Map.tsx).
