import { Fragment, useEffect, useRef } from 'react'
import {
  ACREAGE_DEFINITION,
  ACREAGE_LABEL,
  HABITAT_TYPE_ACRES_HELP,
  HRL_ACRES_HELP,
  PROJECT_ACRES_HELP,
  formatAcreage,
  hasHrlHabitatAcreage,
  totalHrlHabitatAcreage,
} from '../../data/acreage'
import type { ProjectProperties } from '../../data/types'
import { PROJECT_TYPE_COLORS, FALLBACK_COLOR } from '../../features/map/project-colors'
import { getProjectContactMailto } from '../../lib/contact'
import { InfoPopover } from '../info-popover/InfoPopover'
import styles from './DetailPanel.module.css'

interface Props {
  project: ProjectProperties
  onClose: () => void
  onZoomToProject: () => void
}

function fmtBudget(n: number | null | undefined): string {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n)
}

function fmtConstructionYear(value: number | string | null | undefined): string | null {
  if (value == null) return null
  const normalized = String(value).trim()
  if (normalized === '' || /^n\/?a$/i.test(normalized) || /^null$/i.test(normalized)) {
    return null
  }
  return normalized
}

function fmtConstructionRange(
  start: number | string | null | undefined,
  completion: number | string | null | undefined,
): string | null {
  const startYear = fmtConstructionYear(start)
  const completionYear = fmtConstructionYear(completion)

  if (startYear && completionYear) {
    return startYear === completionYear ? startYear : `${startYear} – ${completionYear}`
  }
  if (startYear) return `Starts ${startYear}`
  if (completionYear) return `Completes ${completionYear}`
  return null
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1)
}

function formatList(values: string[]): string {
  return values.map(capitalize).join(', ')
}

export function DetailPanel({ project, onClose, onZoomToProject }: Props) {
  const projectNameRef = useRef<HTMLHeadingElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(
    document.activeElement instanceof HTMLElement ? document.activeElement : null
  )
  const types = Array.isArray(project.project_type) ? project.project_type : []
  const stages = Array.isArray(project.project_stage) ? project.project_stage : []
  const species = Array.isArray(project.target_species) ? project.target_species : []
  const funding = Array.isArray(project.funding_sources) ? project.funding_sources : []

  const constructionRange = fmtConstructionRange(
    project.construction_start_year,
    project.construction_completion_year,
  )

  const acreageRows: { label: string; value: number | null }[] = [
    { label: 'Bypass floodplain', value: project.acreage_bypass_floodplain },
    { label: 'Fish food production', value: project.acreage_fish_food },
    { label: 'Tributary floodplain', value: project.acreage_tributary_floodplain },
    { label: 'Tributary rearing', value: project.acreage_tributary_rearing },
    { label: 'Tributary spawning', value: project.acreage_tributary_spawning },
    { label: 'Tidal wetland', value: project.acreage_tidal_wetland },
  ].filter(r => r.value != null && r.value > 0)
  const hasHrlAcres = hasHrlHabitatAcreage(project)
  const hrlAcres = totalHrlHabitatAcreage(project)

  useEffect(() => {
    projectNameRef.current?.focus()
  }, [project.display_id])

  function handleClose() {
    onClose()
    requestAnimationFrame(() => previousFocusRef.current?.focus())
  }

  return (
    <aside className={styles.panel} aria-label="Project details">
      <div className={styles.header}>
        <button
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close project details"
        >
          ✕
        </button>
      </div>

      <div className={styles.body}>
        <h2 ref={projectNameRef} className={styles.projectName} tabIndex={-1}>
          {project.project_name}
        </h2>
        <button className={styles.zoomBtn} onClick={onZoomToProject}>
          Zoom to project
        </button>

        <div className={styles.typeBadges}>
          {types.map(t => (
            <span
              key={t}
              className={styles.badge}
              style={{ borderColor: PROJECT_TYPE_COLORS[t] ?? FALLBACK_COLOR }}
            >
              <span
                className={styles.badgeDot}
                style={{ background: PROJECT_TYPE_COLORS[t] ?? FALLBACK_COLOR }}
              />
              {capitalize(t)}
            </span>
          ))}
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>{project.system}</span>
        </div>

        {project.project_description && (
          <section className={styles.section}>
            <h3 className={styles.sectionLabel}>Description</h3>
            <p className={styles.description}>{project.project_description}</p>
          </section>
        )}

        <section className={styles.section}>
          <h3 className={styles.sectionLabel}>Overview</h3>
          <dl className={styles.dl}>
            <dt>Lead entity</dt>
            <dd>{project.lead_entity}</dd>
            {stages.length > 0 && (
              <>
                <dt>Current project stage</dt>
                <dd>{formatList(stages)}</dd>
              </>
            )}
            <dt>Anticipated construction years</dt>
            <dd>
              {constructionRange ?? <span className={styles.muted}>Not reported</span>}
            </dd>
            {project.estimated_budget != null && (
              <>
                <dt>Estimated budget</dt>
                <dd>{fmtBudget(project.estimated_budget)}</dd>
              </>
            )}
          </dl>
          <p className={styles.interpretationNote}>
            Project stage is reported by the participating entity and does not, by
            itself, confirm funding, approvals, or construction.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionLabelWithHelp}>
            <h3 className={styles.sectionLabel}>{ACREAGE_LABEL}</h3>
            <InfoPopover label="About project acres" className={styles.detailInfoPopover}>
              {PROJECT_ACRES_HELP}
            </InfoPopover>
          </div>
          <div className={styles.acreageTotal}>
            {project.acreage != null
              ? <><strong>{formatAcreage(project.acreage, 1)}</strong> acres</>
              : <span className={styles.muted}>Not reported</span>}
          </div>
          {hasHrlAcres && (
            <div className={styles.acreageBreakdown}>
              <div className={styles.sectionLabelWithHelp}>
                <h3 className={styles.sectionLabel}>HRL acres</h3>
                <InfoPopover label="About HRL acres" className={styles.detailInfoPopover}>
                  {HRL_ACRES_HELP}
                </InfoPopover>
              </div>
              <div className={styles.acreageTotal}>
                <strong>{formatAcreage(hrlAcres, 1)}</strong> acres
              </div>
              <div className={styles.subsectionLabelWithHelp}>
                <h4 className={styles.subsectionLabel}>HRL habitat type acres</h4>
                <InfoPopover
                  label="About HRL habitat type acres"
                  className={styles.detailInfoPopover}
                >
                  {HABITAT_TYPE_ACRES_HELP}
                </InfoPopover>
              </div>
              {acreageRows.length > 0 && (
                <dl className={styles.dl}>
                  {acreageRows.map(r => (
                    <Fragment key={r.label}>
                      <dt>{r.label}</dt>
                      <dd>{formatAcreage(r.value, 1)} acres</dd>
                    </Fragment>
                  ))}
                </dl>
              )}
            </div>
          )}
          <p className={styles.comment}>{ACREAGE_DEFINITION}</p>
        </section>

        {species.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionLabel}>Target species</h3>
            <ul className={styles.list}>
              {species.map(s => <li key={s}>{s}</li>)}
            </ul>
          </section>
        )}

        {funding.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionLabel}>Funding sources</h3>
            <ul className={styles.list}>
              {funding.map(f => <li key={f}>{f}</li>)}
            </ul>
          </section>
        )}
      </div>
      <footer className={styles.footer}>
        <a className={styles.contactButton} href={getProjectContactMailto(project.project_name)}>
          Contact HRL about this project
        </a>
      </footer>
    </aside>
  )
}
