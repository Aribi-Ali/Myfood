import { test, expect } from '@playwright/test'
import { roleStorage } from './helpers/auth'

test.use({ storageState: roleStorage('chef') })

test.describe('Chef / KDS workflow', () => {
  test('chef dashboard loads', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('KDS kitchen screen loads', async ({ page }) => {
    await page.goto('/kds')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('KDS orders page loads', async ({ page }) => {
    await page.goto('/dashboard/kds')
    await expect(page.locator('body')).not.toBeEmpty()
  })
})
