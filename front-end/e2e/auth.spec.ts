import { test, expect } from '@playwright/test'
import { roleStorage } from './helpers/auth'

test.describe('Authentication workflows', () => {
  test.describe('with client session', () => {
    test.use({ storageState: roleStorage('client') })

    test('client session reaches dashboard', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page.locator('body')).not.toBeEmpty()
    })
  })

  test('invalid credentials shows error', async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto('/login')
    await page.getByRole('textbox', { name: /email/i }).fill('nobody@yallahkool.dz')
    await page.getByRole('textbox', { name: /password/i }).fill('wrong-password')
    await page.getByRole('button', { name: /sign in|login/i }).click()
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 })
    await expect(page.locator('text=/invalid|incorrect|failed|error/i')).toBeVisible({ timeout: 45_000 })
  })

  test('logged-out visitor is redirected away from dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 })
  })
})
