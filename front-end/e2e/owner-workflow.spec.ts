import { test, expect } from '@playwright/test'
import { roleStorage } from './helpers/auth'

test.use({ storageState: roleStorage('owner') })

test.describe('Owner workflow', () => {
  test('dashboard overview loads', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('body')).not.toBeEmpty()
    await expect(page.locator('main, aside').first()).toBeVisible({ timeout: 15_000 })
  })

  test('menu page loads and lists foods', async ({ page }) => {
    await page.goto('/dashboard/menu')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('orders page loads', async ({ page }) => {
    await page.goto('/dashboard/orders')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('settings page loads', async ({ page }) => {
    await page.goto('/dashboard/settings')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('profile store page loads', async ({ page }) => {
    await page.goto('/dashboard/profile/store')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('KDS view loads', async ({ page }) => {
    await page.goto('/dashboard/kds')
    await expect(page.locator('body')).not.toBeEmpty()
  })
})
