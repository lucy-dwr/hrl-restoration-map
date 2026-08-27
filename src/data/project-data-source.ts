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

interface SnapshotPointer {
  snapshot_version: string
  manifest: string
}

interface SnapshotArtifact {
  path: string
}

interface SnapshotManifest {
  snapshot_version?: string
  artifacts: Record<string, SnapshotArtifact>
}

const PROJECT_ARTIFACTS = {
  geojson: 'hrl_restoration_projects.geojson',
  gpkg: 'hrl_restoration_projects.gpkg',
  csv: 'hrl_restoration_projects.csv',
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
    geojson: `${dataPath}${PROJECT_ARTIFACTS.geojson}`,
    gpkg: `${dataPath}${PROJECT_ARTIFACTS.gpkg}`,
    csv: `${dataPath}${PROJECT_ARTIFACTS.csv}`,
  }, fetchImplementation)
}

/**
 * Resolves the future public publication contract without selecting it for the
 * app. The pointer is intentionally fetched first; artifacts are only read
 * from its immutable manifest, never guessed from a version string.
 *
 * Expected public shape (not active for the beta):
 * current.json: { "snapshot_version": "…", "manifest": "<version>/manifest.json" }
 * manifest.json: { "snapshot_version": "…", "artifacts": {
 *   "hrl_restoration_projects.geojson": { "path": "hrl_restoration_projects.geojson" }, …
 * }}
 */
export async function resolvePublicSnapshotProjectDataSource(
  currentUrl: string,
  fetchImplementation: FetchImplementation = fetch,
): Promise<ProjectDataSource> {
  const pointerRecord = getObject(await fetchJson(currentUrl, fetchImplementation), 'current.json')
  const pointer: SnapshotPointer = {
    snapshot_version: getRequiredString(pointerRecord.snapshot_version, 'current.json snapshot_version'),
    manifest: getRequiredString(pointerRecord.manifest, 'current.json manifest'),
  }
  const manifestUrl = resolveSnapshotUrl(pointer.manifest, currentUrl)
  const manifestRecord = getObject(await fetchJson(manifestUrl, fetchImplementation), 'manifest.json')
  const manifest: SnapshotManifest = {
    snapshot_version: typeof manifestRecord.snapshot_version === 'string'
      ? manifestRecord.snapshot_version
      : undefined,
    artifacts: getObject(manifestRecord.artifacts, 'manifest.json artifacts') as Record<string, SnapshotArtifact>,
  }

  if (manifest.snapshot_version !== undefined && manifest.snapshot_version !== pointer.snapshot_version) {
    throw new Error('current.json and manifest.json refer to different snapshot versions.')
  }

  const getArtifactUrl = (format: ProjectDownloadFormat): string => {
    const artifact = getObject(manifest.artifacts[PROJECT_ARTIFACTS[format]], `manifest artifact ${PROJECT_ARTIFACTS[format]}`)
    return resolveSnapshotUrl(getRequiredString(artifact.path, `manifest artifact ${PROJECT_ARTIFACTS[format]} path`), manifestUrl)
  }

  return createDataSource('public-snapshot', {
    geojson: getArtifactUrl('geojson'),
    gpkg: getArtifactUrl('gpkg'),
    csv: getArtifactUrl('csv'),
  }, fetchImplementation)
}
