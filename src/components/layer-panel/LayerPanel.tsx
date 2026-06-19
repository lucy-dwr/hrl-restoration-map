import { PROJECT_TYPE_COLORS, FALLBACK_COLOR } from '../../features/map/project-colors'
import type { BasemapMode } from '../../lib/url-state'
import styles from './LayerPanel.module.css'

const ALL_TYPES = [
  'bypass floodplain habitat',
  'fish food production',
  'fish passage improvement',
  'fish screen installation or improvement',
  'rearing habitat',
  'spawning habitat',
  'tidal habitat',
  'tributary floodplain habitat',
  'other',
]

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1)
}

interface Props {
  basemap: BasemapMode
  onBasemapChange: (mode: BasemapMode) => void
  hiddenTypes: Set<string>
  onToggleType: (type: string) => void
  watershedVisible: boolean
  onToggleWatershed: () => void
  sanJoaquinWatershedVisible: boolean
  onToggleSanJoaquinWatershed: () => void
  deltaBoundaryVisible: boolean
  onToggleDeltaBoundary: () => void
  streamsVisible: boolean
  onToggleStreams: () => void
  open: boolean
  onToggleOpen: () => void
}

export function LayerPanel({
  basemap,
  onBasemapChange,
  hiddenTypes,
  onToggleType,
  watershedVisible,
  onToggleWatershed,
  sanJoaquinWatershedVisible,
  onToggleSanJoaquinWatershed,
  deltaBoundaryVisible,
  onToggleDeltaBoundary,
  streamsVisible,
  onToggleStreams,
  open,
  onToggleOpen,
}: Props) {
  return (
    <div className={styles.root}>
      {open ? (
        <div className={styles.panel}>
          <div className={styles.header}>
            <span className={styles.title}>Layers</span>
            <button
              className={styles.toggleBtn}
              onClick={onToggleOpen}
              aria-label="Collapse layer panel"
            >
              ←
            </button>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionLabel}>Basemap</h3>
            <label className={styles.row}>
              <input
                type="radio"
                name="basemap"
                className={styles.checkbox}
                checked={basemap === 'map'}
                onChange={() => onBasemapChange('map')}
              />
              <span className={styles.typeLabel}>Map</span>
            </label>
            <label className={styles.row}>
              <input
                type="radio"
                name="basemap"
                className={styles.checkbox}
                checked={basemap === 'imagery'}
                onChange={() => onBasemapChange('imagery')}
              />
              <span className={styles.typeLabel}>Imagery</span>
            </label>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h3 className={styles.sectionLabel}>Project types</h3>
            {ALL_TYPES.map(type => {
              const visible = !hiddenTypes.has(type)
              const color = PROJECT_TYPE_COLORS[type] ?? FALLBACK_COLOR
              return (
                <label key={type} className={styles.row}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={visible}
                    onChange={() => onToggleType(type)}
                  />
                  <span
                    className={styles.dot}
                    style={{ background: visible ? color : '#cccccc' }}
                  />
                  <span className={styles.typeLabel} style={{ color: visible ? undefined : 'var(--text-tertiary)' }}>
                    {capitalize(type)}
                  </span>
                </label>
              )
            })}
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h3 className={styles.sectionLabel}>Boundaries</h3>
            <label className={styles.row}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={watershedVisible}
                onChange={onToggleWatershed}
              />
              <span
                className={styles.dot}
                style={{ background: watershedVisible ? '#3f7f9f' : '#cccccc', borderRadius: 2 }}
              />
              <span className={styles.typeLabel} style={{ color: watershedVisible ? undefined : 'var(--text-tertiary)' }}>
                Sacramento watershed
              </span>
            </label>
            <label className={styles.row}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={sanJoaquinWatershedVisible}
                onChange={onToggleSanJoaquinWatershed}
              />
              <span
                className={styles.dot}
                style={{ background: sanJoaquinWatershedVisible ? '#5f8e57' : '#cccccc', borderRadius: 2 }}
              />
              <span className={styles.typeLabel} style={{ color: sanJoaquinWatershedVisible ? undefined : 'var(--text-tertiary)' }}>
                San Joaquin watershed
              </span>
            </label>
            <label className={styles.row}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={deltaBoundaryVisible}
                onChange={onToggleDeltaBoundary}
              />
              <span
                className={styles.dot}
                style={{ background: deltaBoundaryVisible ? '#72528f' : '#cccccc', borderRadius: 2 }}
              />
              <span className={styles.typeLabel} style={{ color: deltaBoundaryVisible ? undefined : 'var(--text-tertiary)' }}>
                Legal Delta boundary
              </span>
            </label>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h3 className={styles.sectionLabel}>Hydrography</h3>
            <label className={styles.row}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={streamsVisible}
                onChange={onToggleStreams}
              />
              <span
                className={styles.dot}
                style={{ background: streamsVisible ? '#4f9ac1' : '#cccccc', borderRadius: 2 }}
              />
              <span className={styles.typeLabel} style={{ color: streamsVisible ? undefined : 'var(--text-tertiary)' }}>
                Stream network
              </span>
            </label>
          </div>
        </div>
      ) : (
        <button
          className={styles.collapsed}
          onClick={onToggleOpen}
          aria-label="Expand layer panel"
        >
          <span className={styles.collapsedIcon}>☰</span>
          <span className={styles.collapsedLabel}>Layers</span>
        </button>
      )}
    </div>
  )
}
