import type { ProjectProperties } from './types'

export const ACREAGE_LABEL = 'Project acres'
export const ACREAGE_TILE_LABEL = 'total HRL project acres'
export const ACREAGE_COMPACT_LABEL = 'acres'

export const HRL_HABITAT_ACREAGE_FIELDS = [
  'acreage_bypass_floodplain',
  'acreage_fish_food',
  'acreage_tributary_floodplain',
  'acreage_tributary_rearing',
  'acreage_tributary_spawning',
  'acreage_tidal_wetland',
] as const satisfies readonly (keyof ProjectProperties)[]

export const ACREAGE_DEFINITION =
  'All acreage values shown are reported by HRL participating entities. They are for public orientation and are not final HRL habitat accounting acres.'

export const PROJECT_ACRES_HELP =
  'Project acres are reported by HRL participating entities for public orientation; they are not final HRL habitat accounting acres. They may include aquatic, transitional, and terrestrial areas, so they may differ from the listed HRL aquatic habitat type acres or the mapped footprint.'

export const TOTAL_PROJECT_ACRES_HELP =
  'Sum of the reported acres for HRL habitat types: bypass floodplain, fish food production, tributary floodplain, tributary rearing, tributary spawning, and tidal wetland. The total includes projects selected by the current filters and layer selections. These values are for public orientation and are not final HRL habitat accounting acres.'

export const HABITAT_TYPE_ACRES_HELP =
  'Acres by HRL aquatic habitat category. These category values may not add up to total project acres because project acres can include other areas, such as terrestrial habitat.'

export const HRL_ACRES_HELP =
  'HRL acres are the total reported acres across HRL aquatic habitat types. Unlike project acres, they do not include other project areas, such as terrestrial habitat. These values are for public orientation and are not final HRL habitat accounting acres.'

export function formatAcreage(
  value: number | null | undefined,
  maximumFractionDigits = 0
): string {
  if (value == null) return '—'
  return value.toLocaleString('en-US', { maximumFractionDigits })
}

export function totalHrlHabitatAcreage(project: ProjectProperties): number {
  return HRL_HABITAT_ACREAGE_FIELDS.reduce(
    (sum, field) => sum + (project[field] ?? 0),
    0
  )
}

export function hasHrlHabitatAcreage(project: ProjectProperties): boolean {
  return HRL_HABITAT_ACREAGE_FIELDS.some(field => project[field] != null)
}
