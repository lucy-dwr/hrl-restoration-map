import { PROJECT_TYPE_COLORS, FALLBACK_COLOR } from '../../features/map/project-colors'
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
  hiddenTypes: Set<string>
  onToggleType: (type: string) => void
  watershedVisible: boolean
  onToggleWatershed: () => void
  open: boolean
  onToggleOpen: () => void
}

export function LayerPanel({
  hiddenTypes,
  onToggleType,
  watershedVisible,
  onToggleWatershed,
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
                style={{ background: watershedVisible ? '#6fa8d0' : '#cccccc', borderRadius: 2 }}
              />
              <span className={styles.typeLabel} style={{ color: watershedVisible ? undefined : 'var(--text-tertiary)' }}>
                Sacramento watershed
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
