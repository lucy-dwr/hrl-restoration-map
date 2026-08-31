import type { FeatureCollection } from 'geojson'

export type ProjectDownloadFormat = 'geojson' | 'gpkg' | 'csv'

export interface ProjectDownloadUrls {
  geojson: string
  gpkg: string
  csv: string
}

export interface ProjectDataSource {
  readonly kind: 'static' | 'public-snapshot'
  readonly downloads: ProjectDownloadUrls
  loadProjects(): Promise<FeatureCollection>
}

type FetchImplementation = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

/**
 * Matches `hrl-pipeline promote`'s `current.json` exactly (see
 * `hrl_restoration_pipeline.publication.activate_local_snapshot`): a single
 * pointer file with the version's artifact paths embedded directly. There is
 * no separate manifest.json — current.json is the whole contract.
 */
interface SnapshotPointer {
  snapshot_version: string
  artifacts: Record<string, unknown>
}

const STATIC_PROJECT_ARTIFACTS = {
  geojson: 'hrl_restoration_projects.geojson',
  gpkg: 'hrl_restoration_projects.gpkg',
  csv: 'hrl_restoration_projects.csv',
} as const

/**
 * Filenames `hrl-pipeline promote`'s `publish_local` actually writes under
 * each immutable version directory. These are pipeline output, not the
 * static beta fixture names above — do not merge the two.
 */
const SNAPSHOT_PROJECT_ARTIFACTS = {
  geojson: 'projects.geojson',
  gpkg: 'projects.gpkg',
  csv: 'projects.csv',
} as const

function withTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`
}

function getRequiredString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string.`)
  }

  return value
}

function getObject(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`)
  }

  return value as Record<string, unknown>
}

async function fetchJson(url: string, fetchImplementation: FetchImplementation): Promise<unknown> {
  const response = await fetchImplementation(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) {
    throw new Error(`Could not load ${url}: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<unknown>
}

function normalizeProjectProperties(data: FeatureCollection): FeatureCollection {
  return {
    ...data,
    features: data.features.map(feature => {
      const properties = (feature.properties ?? {}) as Record<string, unknown>
      const legacyId = properties.display_id
      const projectId = typeof properties.project_id === 'string' && properties.project_id.trim() !== ''
        ? properties.project_id
        : typeof legacyId === 'string' ? legacyId : ''
      const leadEntity = Array.isArray(properties.lead_entity)
        ? properties.lead_entity
        : typeof properties.lead_entity === 'string'
          ? properties.lead_entity.split(';').map(value => value.trim()).filter(Boolean)
          : []

      return {
        ...feature,
        properties: { ...properties, project_id: projectId, lead_entity: leadEntity },
      }
    }),
  }
}

function createDataSource(
  kind: ProjectDataSource['kind'],
  downloads: ProjectDownloadUrls,
  fetchImplementation: FetchImplementation,
): ProjectDataSource {
  return {
    kind,
    downloads,
    async loadProjects() {
      return normalizeProjectProperties(
        await fetchJson(downloads.geojson, fetchImplementation) as FeatureCollection
      )
    },
  }
}

function resolveSnapshotUrl(path: string, baseUrl: string): string {
  const base = new URL(baseUrl)
  const resolved = new URL(path, base)

  if (resolved.origin !== base.origin) {
    throw new Error('Public snapshot artifacts must be served from the same origin as current.json.')
  }

  return resolved.toString()
}

/**
 * The deployed beta always uses this source. `basePath` keeps checked-in data
 * working under both the root site and the Front Door path prefix.
 */
export function createStaticProjectDataSource(
  basePath: string,
  fetchImplementation: FetchImplementation = fetch,
): ProjectDataSource {
  const dataPath = `${withTrailingSlash(basePath)}data/`

  return createDataSource('static', {
    geojson: `${dataPath}${STATIC_PROJECT_ARTIFACTS.geojson}`,
    gpkg: `${dataPath}${STATIC_PROJECT_ARTIFACTS.gpkg}`,
    csv: `${dataPath}${STATIC_PROJECT_ARTIFACTS.csv}`,
  }, fetchImplementation)
}

/**
 * Resolves the public publication contract without selecting it for the app.
 * Artifacts are read only from the pointer's own `artifacts` map, never
 * guessed from the version string.
 *
 * Public shape (not yet active for the beta), matching `current.json` as
 * `hrl-pipeline promote` writes it:
 * { "snapshot_version": "…", "artifacts": {
 *     "projects.geojson": "<version>/projects.geojson",
 *     "projects.gpkg": "<version>/projects.gpkg",
 *     "projects.csv": "<version>/projects.csv",
 *     "metadata.json": "<version>/metadata.json" }, … }
 * Artifact paths are relative to current.json itself.
 */
export async function resolvePublicSnapshotProjectDataSource(
  currentUrl: string,
  fetchImplementation: FetchImplementation = fetch,
): Promise<ProjectDataSource> {
  const pointerRecord = getObject(await fetchJson(currentUrl, fetchImplementation), 'current.json')
  const pointer: SnapshotPointer = {
    snapshot_version: getRequiredString(pointerRecord.snapshot_version, 'current.json snapshot_version'),
    artifacts: getObject(pointerRecord.artifacts, 'current.json artifacts'),
  }

  const getArtifactUrl = (format: ProjectDownloadFormat): string => {
    const name = SNAPSHOT_PROJECT_ARTIFACTS[format]
    return resolveSnapshotUrl(getRequiredString(pointer.artifacts[name], `current.json artifact ${name}`), currentUrl)
  }

  return createDataSource('public-snapshot', {
    geojson: getArtifactUrl('geojson'),
    gpkg: getArtifactUrl('gpkg'),
    csv: getArtifactUrl('csv'),
  }, fetchImplementation)
}
