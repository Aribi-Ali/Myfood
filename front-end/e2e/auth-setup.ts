import { test as setup, expect, type Page } from '@playwright/test'
import { USERS, type TestUser } from './helpers/auth'

const storageDir = 'e2e/.auth'

async function loginAndSave(page: Page, user: TestUser, role: string) {
  await page.goto('/login')
  await page.getByRole('textbox', { name: /email/i }).fill(user.email)
  await page.getByRole('textbox', { name: /password/i }).fill(user.password)
  await page.getByRole('button', { name: /sign in|login/i }).click()
  await page.waitForURL(/\/dashboard/, { timeout: 20_000 })
  await page.context().storageState({ path: `${storageDir}/${role}.json` })
}

setup('authenticate as client', async ({ page }) => {
  await loginAndSave(page, USERS.client, 'client')
})

setup('authenticate as owner', async ({ page }) => {
  await loginAndSave(page, USERS.owner, 'owner')
})

setup('authenticate as delivery', async ({ page }) => {
  await loginAndSave(page, USERS.delivery, 'delivery')
})

setup('authenticate as chef', async ({ page }) => {
  await loginAndSave(page, USERS.chef, 'chef')
})

setup('authenticate as admin', async ({ page }) => {
  await loginAndSave(page, USERS.admin, 'admin')
})
