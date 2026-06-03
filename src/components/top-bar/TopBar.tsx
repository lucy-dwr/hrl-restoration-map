import styles from './TopBar.module.css'

export function TopBar() {
  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <span className={styles.brandName}>HRL Dashboard</span>
        <span className={styles.brandSub}>Healthy Rivers &amp; Landscapes</span>
      </div>
      <nav className={styles.nav}>
        <a href="#about" className={styles.navLink}>About</a>
      </nav>
    </header>
  )
}
