import { test, expect } from '@playwright/test'
import { roleStorage } from './helpers/auth'

test.use({ storageState: roleStorage('admin') })

test.describe('Admin workflow', () => {
  test('admin dashboard loads', async ({ page }) => {
    await page.goto('/dashboard/admin')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('admin stores management loads', async ({ page }) => {
    await page.goto('/dashboard/admin/stores')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('admin templates loads', async ({ page }) => {
    await page.goto('/dashboard/admin/templates')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('admin users management loads', async ({ page }) => {
    await page.goto('/dashboard/admin/users')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('admin orders management loads', async ({ page }) => {
    await page.goto('/dashboard/admin/orders')
    await expect(page.locator('body')).not.toBeEmpty()
  })
})
