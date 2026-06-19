import type { ExpressionSpecification } from 'maplibre-gl'

// CVD-screened palette, hue-separated at typical zoom, and kept away from
// the stream-network hydro blues used in Map.tsx.
// Covers all ProjectTypeEnum values in the vendored LinkML schema.
export const PROJECT_TYPE_COLORS: Record<string, string> = {
  'bypass floodplain habitat':                '#8c510a', // umber
  'fish food production':                     '#bf9b00', // mustard
  'fish passage improvement':                 '#d95f02', // orange
  'fish screen installation or improvement':  '#6a3d9a', // purple
  'rearing habitat':                          '#c51b7d', // magenta
  'spawning habitat':                         '#b2182b', // crimson
  'tidal habitat':                            '#018571', // green-teal
  'tributary floodplain habitat':             '#4d9221', // green
  'other':                                    '#737373', // gray
}

export const FALLBACK_COLOR = '#737373'

export const TYPE_MATCH_EXPR: ExpressionSpecification = [
  'match',
  ['get', 'primary_type'],
  'bypass floodplain habitat',                '#8c510a',
  'fish food production',                     '#bf9b00',
  'fish passage improvement',                 '#d95f02',
  'fish screen installation or improvement',  '#6a3d9a',
  'rearing habitat',                          '#c51b7d',
  'spawning habitat',                         '#b2182b',
  'tidal habitat',                            '#018571',
  'tributary floodplain habitat',             '#4d9221',
  'other',                                    '#737373',
  FALLBACK_COLOR,
]
