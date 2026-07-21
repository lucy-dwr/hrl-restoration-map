import { useState, useRef, useEffect, useId } from 'react'
import styles from './TopBar.module.css'

function DownloadMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <div ref={ref} className={styles.downloadWrapper}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.navLink}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={menuId}
      >
        Download data
      </button>
      {open && (
        <div id={menuId} className={styles.downloadMenu} aria-label="Download data formats">
          <a
            href="data/hrl_restoration_projects.geojson"
            download="hrl_restoration_projects.geojson"
            className={styles.downloadItem}
            onClick={() => setOpen(false)}
          >
            <span className={styles.downloadFormat}>GeoJSON</span>
            <span className={styles.downloadDesc}>For web mapping and scripting</span>
          </a>
          <a
            href="data/hrl_restoration_projects.gpkg"
            download="hrl_restoration_projects.gpkg"
            className={styles.downloadItem}
            onClick={() => setOpen(false)}
          >
            <span className={styles.downloadFormat}>GeoPackage</span>
            <span className={styles.downloadDesc}>For QGIS, ArcGIS, and other GIS tools</span>
          </a>
          <a
            href="data/hrl_restoration_projects.csv"
            download="hrl_restoration_projects.csv"
            className={styles.downloadItem}
            onClick={() => setOpen(false)}
          >
            <span className={styles.downloadFormat}>CSV</span>
            <span className={styles.downloadDesc}>Attributes only, no spatial data</span>
          </a>
        </div>
      )}
    </div>
  )
}

interface TopBarProps {
  onAboutOpen: () => void
  onMethodologyOpen: () => void
}

export function TopBar({ onAboutOpen, onMethodologyOpen }: TopBarProps) {
  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          <img src="/hrl-logo-mark.png" alt="" />
        </span>
        <div className={styles.brandCopy}>
          <h1
            className={styles.brandName}
            aria-label="Healthy Rivers and Landscapes Restoration Dashboard"
          >
            <span>Healthy Rivers and Landscapes</span>
            <span className={styles.brandDescriptor}>Restoration Dashboard</span>
          </h1>
          <span className={styles.brandPurpose}>
            Explore early implementation and proposed restoration project locations and basic descriptions.
          </span>
        </div>
      </div>
      <nav className={styles.nav}>
        <DownloadMenu />
        <button type="button" className={styles.navLink} onClick={onMethodologyOpen}>
          Methodology
        </button>
        <button type="button" className={styles.aboutLink} onClick={onAboutOpen}>
          About this map
        </button>
      </nav>
    </header>
  )
}
