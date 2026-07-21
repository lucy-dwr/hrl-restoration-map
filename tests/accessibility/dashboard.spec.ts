import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const wcagAaTags = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22a',
  'wcag22aa',
]

async function dismissOrientation(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('hrl-dashboard-first-run-orientation-dismissed', '1')
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /healthy rivers and landscapes/i })).toBeVisible()
}

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(wcagAaTags).analyze()
  expect(results.violations).toEqual([])
}

test.describe('automated WCAG A/AA checks', () => {
  test('the initial dashboard has no detectable violations', async ({ page }) => {
    await dismissOrientation(page)
    await expectNoA11yViolations(page)
  })

  test('the About dialog manages focus and has no detectable violations', async ({ page }) => {
    await dismissOrientation(page)
    const aboutButton = page.getByRole('button', { name: 'About this map' })
    await aboutButton.click()

    const dialog = page.getByRole('dialog', { name: 'About This Map' })
    await expect(dialog).toBeVisible()
    await expect(page.getByRole('button', { name: 'Close About dialog' })).toBeFocused()
    await expectNoA11yViolations(page)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(aboutButton).toBeFocused()
  })

  test('Layers controls expose state and have no detectable violations', async ({ page }) => {
    await dismissOrientation(page)
    const projectTypes = page.getByRole('button', { name: 'Project types' })
    await expect(projectTypes).toHaveAttribute('aria-expanded', 'true')

    const firstLayer = page.getByRole('checkbox').first()
    await expect(firstLayer).toBeChecked()
    await firstLayer.press('Space')
    await expect(firstLayer).not.toBeChecked()
    await expectNoA11yViolations(page)
  })

  test('Projects search, selected detail, and download menu have no detectable violations', async ({ page }) => {
    await dismissOrientation(page)
    await page.getByRole('tab', { name: 'Projects' }).click()
    const search = page.getByRole('searchbox', { name: /search projects/i })
    await search.fill('fish')
    await expect(search).toHaveValue('fish')
    await expectNoA11yViolations(page)

    const projectButton = page.getByRole('list').getByRole('button').first()
    await projectButton.click()
    const detail = page.getByRole('complementary', { name: 'Project details' })
    await expect(detail).toBeVisible()
    await expect(detail.getByRole('heading', { level: 2 })).toBeFocused()
    await expectNoA11yViolations(page)

    await detail.getByRole('button', { name: 'Close project details' }).click()
    await page.getByRole('button', { name: 'Download data' }).click()
    await expect(page.getByLabel('Download data formats')).toBeVisible()
    await expectNoA11yViolations(page)
    await page.keyboard.press('Escape')
    await expect(page.getByLabel('Download data formats')).toBeHidden()
  })

  test('a narrow supported viewport has no detectable violations or horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 })
    await dismissOrientation(page)
    await expectNoA11yViolations(page)
    const hasNoHorizontalOverflow = await page.locator('html').evaluate(
      element => element.scrollWidth <= element.clientWidth
    )
    expect(hasNoHorizontalOverflow).toBe(true)
  })
})
