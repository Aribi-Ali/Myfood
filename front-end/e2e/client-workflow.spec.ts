import { test, expect } from '@playwright/test'
import { roleStorage, STORE_ALIAS } from './helpers/auth'

test.use({ storageState: roleStorage('client') })

test.describe('Client ordering workflow', () => {
  test('browse stores and open a store detail page', async ({ page }) => {
    await page.goto('/stores')
    const card = page.locator(`a[href="/stores/${STORE_ALIAS}"]`)
    await expect(card).toBeVisible({ timeout: 15_000 })
    await Promise.all([
      page.waitForURL(/\/stores\/pizza-napoli-1-1/),
      card.click(),
    ])
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('add item to cart and open checkout', async ({ page }) => {
    await page.goto(`/stores/${STORE_ALIAS}`)
    const addButton = page.getByRole('button', { name: /add/i }).first()
    await expect(addButton).toBeVisible({ timeout: 20_000 })
    await addButton.click()
    await page.locator('div.fixed.bottom-6 button').click()
    await expect(page.getByRole('button', { name: /checkout/i })).toBeVisible({ timeout: 15_000 })
  })

  test('place a pickup order end-to-end', async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto(`/stores/${STORE_ALIAS}`)

    const addButton = page.getByRole('button', { name: /add/i }).first()
    await expect(addButton).toBeVisible({ timeout: 20_000 })
    await addButton.click()

    await page.locator('div.fixed.bottom-6 button').click()
    await page.getByRole('button', { name: /pickup/i }).click()
    await page.getByRole('button', { name: /checkout/i }).click()
    await page.locator('input[type="tel"]').fill('+213555123456')
    await page.getByRole('dialog', { name: /checkout/i }).getByRole('button', { name: /order now/i }).click()

    await expect(page.getByRole('dialog', { name: /checkout/i })).toBeHidden({ timeout: 30_000 })
    await expect(page.locator('div.fixed.bottom-6 button')).toBeHidden({ timeout: 30_000 })
  })

  test('my orders page lists orders', async ({ page }) => {
    await page.goto('/profile/orders')
    await expect(page.locator('h1, [class*="text-2xl"]').first()).toBeVisible({ timeout: 15_000 })
  })
})
