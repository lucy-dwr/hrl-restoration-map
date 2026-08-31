import { describe, expect, it, vi } from 'vitest'
import {
  createStaticProjectDataSource,
  resolvePublicSnapshotProjectDataSource,
} from '../../src/data/project-data-source'

const projects = { type: 'FeatureCollection', features: [] }

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), { status: 200 })
}

describe('project data sources', () => {
  it('keeps checked-in static artifacts under the configured deployment path', async () => {
    const fetchImplementation = vi.fn().mockResolvedValue(jsonResponse(projects))
    const source = createStaticProjectDataSource('/restoration-map/', fetchImplementation)

    expect(source.kind).toBe('static')
    expect(source.downloads).toEqual({
      geojson: '/restoration-map/data/hrl_restoration_projects.geojson',
      gpkg: '/restoration-map/data/hrl_restoration_projects.gpkg',
      csv: '/restoration-map/data/hrl_restoration_projects.csv',
    })
    await expect(source.loadProjects()).resolves.toEqual(projects)
    expect(fetchImplementation).toHaveBeenCalledWith(
      '/restoration-map/data/hrl_restoration_projects.geojson',
      expect.anything(),
    )
  })

  it('uses project_id and normalizes lead entities while supporting the legacy beta snapshot', async () => {
    const legacyProjects = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { display_id: 'project-1', lead_entity: 'DWR; River Partners' },
        geometry: null,
      }],
    }
    const fetchImplementation = vi.fn().mockResolvedValue(jsonResponse(legacyProjects))
    const source = createStaticProjectDataSource('/', fetchImplementation)

    await expect(source.loadProjects()).resolves.toMatchObject({
      features: [{
        properties: { project_id: 'project-1', lead_entity: ['DWR', 'River Partners'] },
      }],
    })
  })

  it('resolves immutable project artifacts directly from current.json, matching hrl-pipeline promote', async () => {
    const fetchImplementation = vi.fn()
      .mockResolvedValueOnce(jsonResponse({
        snapshot_version: '2026-08-24',
        schema_version: 'v1.3.1',
        pipeline_version: '0.4.0',
        artifacts: {
          'projects.geojson': '2026-08-24/projects.geojson',
          'projects.gpkg': '2026-08-24/projects.gpkg',
          'projects.csv': '2026-08-24/projects.csv',
          'metadata.json': '2026-08-24/metadata.json',
        },
        output_checksums: {
          'projects.geojson': 'abc123',
          'projects.gpkg': 'def456',
          'projects.csv': 'ghi789',
        },
      }))
      .mockResolvedValueOnce(jsonResponse(projects))

    const source = await resolvePublicSnapshotProjectDataSource(
      'https://data.example.gov/restoration-projects/current.json',
      fetchImplementation,
    )

    expect(source.kind).toBe('public-snapshot')
    expect(source.downloads).toEqual({
      geojson: 'https://data.example.gov/restoration-projects/2026-08-24/projects.geojson',
      gpkg: 'https://data.example.gov/restoration-projects/2026-08-24/projects.gpkg',
      csv: 'https://data.example.gov/restoration-projects/2026-08-24/projects.csv',
    })
    await expect(source.loadProjects()).resolves.toEqual(projects)
    expect(fetchImplementation).toHaveBeenNthCalledWith(
      2,
      'https://data.example.gov/restoration-projects/2026-08-24/projects.geojson',
      expect.anything(),
    )
  })

  it('rejects a pointer missing a required artifact', async () => {
    const fetchImplementation = vi.fn().mockResolvedValue(jsonResponse({
      snapshot_version: '2026-08-24',
      artifacts: {
        'projects.geojson': '2026-08-24/projects.geojson',
      },
    }))

    await expect(resolvePublicSnapshotProjectDataSource(
      'https://data.example.gov/restoration-projects/current.json',
      fetchImplementation,
    )).rejects.toThrow('projects.gpkg')
  })

  it('rejects a pointer that tries to move an artifact to another origin', async () => {
    const fetchImplementation = vi.fn().mockResolvedValue(jsonResponse({
      snapshot_version: '2026-08-24',
      artifacts: {
        'projects.geojson': 'https://untrusted.example/projects.geojson',
        'projects.gpkg': '2026-08-24/projects.gpkg',
        'projects.csv': '2026-08-24/projects.csv',
      },
    }))

    await expect(resolvePublicSnapshotProjectDataSource(
      'https://data.example.gov/restoration-projects/current.json',
      fetchImplementation,
    )).rejects.toThrow('same origin')
  })
})
