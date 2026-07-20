/**
 * Curated search aliases for organizations named in the public project data
 * and expected future records.
 * Keep aliases explicit: automatic acronym generation is too prone to false matches.
 */
const SEARCH_ALIASES: Record<string, readonly string[]> = {
  cdfw: ['california department of fish and wildlife'],
  dwr: ['california department of water resources'],
  'east bay mud': ['east bay municipal utility district'],
  ebmud: ['east bay municipal utility district'],
  ggrf: ['greenhouse gas reduction fund'],
  mid: ['modesto irrigation district'],
  'prop 1': ['proposition 1'],
  'prop 68': ['proposition 68'],
  sbfca: ['sutter butte flood control agency'],
  'sf puc': ['san francisco public utilities commission'],
  sfpuc: ['san francisco public utilities commission'],
  scwa: ['solano county water agency'],
  'solano water': ['solano county water agency'],
  swrcb: ['state water resources control board'],
  syrcl: ['south yuba river citizen league'],
  tid: ['turlock irrigation district'],
  usbr: ['united states bureau of reclamation'],
  usfws: ['united states fish and wildlife service'],
  'state water board': ['state water resources control board'],
  'water board': ['state water resources control board'],
  wcb: ['wildlife conservation board'],
  ywa: ['yuba water agency'],
}

export function getSearchTerms(search: string): string[] {
  const query = search.trim().toLowerCase()
  if (!query) return []
  return [query, ...(SEARCH_ALIASES[query] ?? [])]
}

export function matchesSearch(value: string, search: string): boolean {
  return getSearchTerms(search).some(term => value.toLowerCase().includes(term))
}

export function listMatchesSearch(
  values: string[] | null | undefined,
  search: string,
): boolean {
  return Array.isArray(values) && values.some(value => matchesSearch(value, search))
}
