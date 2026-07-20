# Tiles and metrics sub-specification

**Status:** Adopted for the current prototype  
**Parent:** [`SPEC.md`](../../SPEC.md), Sections 1, 5, 9, and 16

Headline tiles communicate orientation, not verified HRL habitat accounting. They are calculated over the same filtered project set used by the map and project list.

| Tile | Definition | Public interpretation |
|---|---|---|
| Projects | Count of currently visible filtered projects | A count of mapped early-implementation and proposed project records. |
| Total HRL project acres | Sum of the six reported HRL habitat-type acreage fields across currently visible filtered projects | Reported project area for public orientation; not final HRL habitat accounting acres. |

The acreage fields are `acreage_bypass_floodplain`, `acreage_fish_food`, `acreage_tributary_floodplain`, `acreage_tributary_rearing`, `acreage_tributary_spawning`, and `acreage_tidal_wetland`.

Project details separately display total reported project acreage (`acreage`) and the six-field HRL habitat acreage total. Targeted inline help accompanies the headline acreage tile and detailed acreage sections. Do not substitute the single `acreage` field for the headline calculation without a superseding Decision Log entry.

Metric implementation belongs with the UI that consumes it; changes require tests for filtering, missing values, and multi-type records.
