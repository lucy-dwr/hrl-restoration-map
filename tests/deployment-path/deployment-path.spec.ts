import { expect, test } from '@playwright/test'

test.describe('prefixed production deployment', () => {
  test.skip(
    process.env.PUBLIC_BASE_PATH !== '/restoration-map/',
    'This suite runs only against the prefixed production build.'
  )

  test('loads application-owned assets and preserves the public path in shared state', async ({ page }) => {
    const applicationFailures: string[] = []
    const applicationConsoleErrors: string[] = []
    const pageErrors: string[] = []

    const isApplicationUrl = (url: string) => {
      const parsed = new URL(url)
      return (
        parsed.origin === 'http://127.0.0.1:4173' &&
        parsed.pathname.startsWith('/restoration-map/')
      )
    }

    page.on('response', response => {
      if (isApplicationUrl(response.url()) && response.status() >= 400) {
        applicationFailures.push(`${response.status()} ${new URL(response.url()).pathname}`)
      }
    })
    page.on('requestfailed', request => {
      if (isApplicationUrl(request.url())) {
        applicationFailures.push(`request failed ${request.url()}`)
      }
    })
    page.on('console', message => {
      if (message.type() === 'error' && isApplicationUrl(message.location().url)) {
        applicationConsoleErrors.push(message.text())
      }
    })
    page.on('pageerror', error => pageErrors.push(error.message))

    const projectData = page.waitForResponse(response => (
      response.url().endsWith('/restoration-map/data/hrl_restoration_projects.geojson') &&
      response.ok()
    ))

    await page.addInitScript(() => {
      window.localStorage.setItem('hrl-dashboard-first-run-orientation-dismissed', '1')
    })
    await page.goto('./')
    await projectData

    await expect(page.getByRole('heading', { name: /healthy rivers and landscapes/i })).toBeVisible()
    await expect(page.locator('img[src="/restoration-map/hrl-logo-mark.png"]')).toBeVisible()

    await page.getByRole('button', { name: 'Download data' }).click()
    await expect(page.getByRole('link', { name: 'GeoJSON' })).toHaveAttribute(
      'href',
      '/restoration-map/data/hrl_restoration_projects.geojson'
    )

    await page.getByRole('tab', { name: 'Projects' }).click()
    await page.getByRole('list').getByRole('button').first().click()
    await expect(page).toHaveURL(/\/restoration-map\/\?selected=/)

    await page.getByRole('button', { name: 'Close project details' }).click()
    await expect.poll(() => new URL(page.url()).searchParams.has('selected')).toBe(false)
    expect(new URL(page.url()).pathname).toBe('/restoration-map/')
    expect(applicationFailures).toEqual([])
    expect(applicationConsoleErrors).toEqual([])
    expect(pageErrors).toEqual([])
  })
})
