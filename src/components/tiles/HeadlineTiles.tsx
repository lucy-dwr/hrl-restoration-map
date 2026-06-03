import type { FeatureCollection } from 'geojson'
import type { ProjectProperties } from '../../data/types'
import styles from './HeadlineTiles.module.css'

interface Props {
  data: FeatureCollection | null
}

export function HeadlineTiles({ data }: Props) {
  if (!data) return null

  const features = data.features
  const total = features.length

  const withAcreage = features.filter(
    f => (f.properties as ProjectProperties).display_acreage != null
  )
  const totalAcreage = withAcreage.reduce(
    (sum, f) => sum + ((f.properties as ProjectProperties).display_acreage ?? 0),
    0
  )

  const earlyImpl = features.filter(
    f => (f.properties as ProjectProperties).early_implementation
  ).length

  return (
    <div className={styles.strip}>
      <div className={styles.tile}>
        <span className={styles.value}>{total}</span>
        <span className={styles.label}>Projects</span>
        <span className={styles.sub}>across the watershed</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.tile}>
        <span className={styles.value}>
          {withAcreage.length > 0
            ? totalAcreage.toLocaleString('en-US', { maximumFractionDigits: 0 })
            : '—'}
        </span>
        <span className={styles.label}>Acres submitted</span>
        <span className={styles.sub}>
          {withAcreage.length < total
            ? `${withAcreage.length} of ${total} reporting`
            : 'across all projects'}
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.tile}>
        <span className={styles.value}>{earlyImpl}</span>
        <span className={styles.label}>Early implementation</span>
        <span className={styles.sub}>priority projects</span>
      </div>
    </div>
  )
}
