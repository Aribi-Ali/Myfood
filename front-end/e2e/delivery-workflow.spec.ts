import { test, expect } from '@playwright/test'
import { roleStorage } from './helpers/auth'

test.use({ storageState: roleStorage('delivery') })

test.describe('Delivery workflow', () => {
  test('available orders page loads', async ({ page }) => {
    await page.goto('/delivery')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('active deliveries page loads', async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto('/delivery/active')
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 45_000 })
  })

  test('earnings dashboard loads', async ({ page }) => {
    await page.goto('/dashboard/earnings')
    await expect(page.locator('body')).not.toBeEmpty()
  })
})
