// URL state encoding/decoding for the HRL Dashboard.
//
// Schema:
//   ?lat=38.4000&lng=-121.8000&zoom=7.00
//   &selected=project-3
//   &hidden=spawning+habitat,tidal+habitat   (comma-separated type keys)
//   &watershed=0                             (absent = visible; "0" = hidden)

export interface UrlState {
  lat: number
  lng: number
  zoom: number
  selected: string | null
  hiddenTypes: Set<string>
  watershedVisible: boolean
}

const DEFAULTS: UrlState = {
  lat: 38.4,
  lng: -121.8,
  zoom: 7,
  selected: null,
  hiddenTypes: new Set(),
  watershedVisible: true,
}

export function readUrlState(): UrlState {
  const p = new URLSearchParams(window.location.search)

  const lat = parseFloat(p.get('lat') ?? '')
  const lng = parseFloat(p.get('lng') ?? '')
  const zoom = parseFloat(p.get('zoom') ?? '')
  const hidden = p.get('hidden') ?? ''

  return {
    lat: Number.isFinite(lat) ? lat : DEFAULTS.lat,
    lng: Number.isFinite(lng) ? lng : DEFAULTS.lng,
    zoom: Number.isFinite(zoom) ? zoom : DEFAULTS.zoom,
    selected: p.get('selected') ?? null,
    hiddenTypes: new Set(hidden ? hidden.split(',').filter(Boolean) : []),
    watershedVisible: p.get('watershed') !== '0',
  }
}

export function writeUrlState(state: Partial<UrlState>): void {
  const p = new URLSearchParams(window.location.search)

  if (state.lat !== undefined) p.set('lat', state.lat.toFixed(4))
  if (state.lng !== undefined) p.set('lng', state.lng.toFixed(4))
  if (state.zoom !== undefined) p.set('zoom', state.zoom.toFixed(2))

  if ('selected' in state) {
    if (state.selected) p.set('selected', state.selected)
    else p.delete('selected')
  }

  if (state.hiddenTypes !== undefined) {
    if (state.hiddenTypes.size > 0) {
      p.set('hidden', [...state.hiddenTypes].join(','))
    } else {
      p.delete('hidden')
    }
  }

  if (state.watershedVisible !== undefined) {
    if (state.watershedVisible) p.delete('watershed')
    else p.set('watershed', '0')
  }

  history.replaceState(null, '', p.toString() ? `?${p.toString()}` : window.location.pathname)
}
