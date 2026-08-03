import { test, expect } from '@playwright/test'

test.describe('Storefront public pages', () => {
  test('home page loads with brand', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('stores listing renders store cards', async ({ page }) => {
    await page.goto('/stores')
    // Seeded store alias (SeedFakeData): "Pizza Napoli #1" -> pizza-napoli-1-1
    const card = page.locator('a[href="/stores/pizza-napoli-1-1"]')
    await expect(card).toBeVisible({ timeout: 15_000 })
  })

  test('store detail page renders', async ({ page }) => {
    await page.goto('/stores/pizza-napoli-1-1')
    await expect(page).toHaveURL(/\/stores\/pizza-napoli-1-1/)
    await expect(page.locator('main, [class*="min-h-screen"]').first()).toBeVisible({ timeout: 15_000 })
  })
})

test.describe('i18n', () => {
  test('language switcher switches locale', async ({ page }) => {
    await page.goto('/stores')
    await page.getByRole('button', { name: 'FR', exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  })
})
