import { type Page, expect } from '@playwright/test'

export const STORE_ALIAS = 'pizza-napoli-1-1'
export const OWNER_STORE_ALIAS = STORE_ALIAS

export interface TestUser {
  email: string
  password: string
  name: string
}

export const USERS: Record<'admin' | 'owner' | 'client' | 'delivery' | 'chef', TestUser> = {
  admin: { email: 'admin@yallahkool.dz', password: 'password', name: 'Admin User' },
  owner: { email: 'owner1@yallahkool.dz', password: 'password', name: 'Owner 1' },
  client: { email: 'client1@yallahkool.dz', password: 'password', name: 'Client 1' },
  delivery: { email: 'delivery1@yallahkool.dz', password: 'password', name: 'Delivery 1' },
  chef: { email: 'chef1@yallahkool.dz', password: 'password', name: 'Chef 1' },
}

export const roleStorage = (role: keyof typeof USERS): string => `e2e/.auth/${role}.json`

/** Log in via the UI login page. Used by the setup project only. */
export async function loginAs(page: Page, user: TestUser): Promise<void> {
  await page.goto('/login')
  await page.getByRole('textbox', { name: /email/i }).fill(user.email)
  await page.getByRole('textbox', { name: /password/i }).fill(user.password)
  await page.getByRole('button', { name: /sign in|login/i }).click()
}

/** Assert the user reaches the authenticated dashboard. */
export async function expectAuthenticated(page: Page): Promise<void> {
  await page.waitForURL(/\/dashboard/, { timeout: 15_000 })
}
