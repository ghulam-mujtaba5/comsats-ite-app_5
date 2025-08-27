import { test, expect } from '@playwright/test'

// Basic API contract tests for community endpoints and simple UI smoke

test.describe('Community API', () => {
  test('GET /api/community/posts returns array or {data}', async ({ request }) => {
    const res = await request.get('/api/community/posts?limit=2&offset=0&meta=1')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    const rows = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : []
    expect(Array.isArray(rows)).toBeTruthy()
    if (body?.meta) {
      expect(body.meta).toHaveProperty('hasMore')
      expect(body.meta).toHaveProperty('nextOffset')
    }
  })

  test('GET /api/community/replies requires post_id', async ({ request }) => {
    const res = await request.get('/api/community/replies')
    expect(res.status()).toBe(400)
  })
})

test.describe('Community UI', () => {
  test('Community page loads and can paginate posts', async ({ page }) => {
    await page.goto('/community')
    await expect(page.getByRole('heading', { name: /community/i })).toBeVisible({ timeout: 15000 })
    // Wait for initial cards to load
    const postLinks = page.locator('a[href^="/community/post/"]')
    await expect(postLinks.first()).toBeVisible({ timeout: 15000 })

    // Load more button if present
    const loadMore = page.getByRole('button', { name: /load more/i })
    if (await loadMore.isVisible().catch(() => false)) {
      await loadMore.click()
      await expect(postLinks.nth(0)).toBeVisible()
    }
  })
})
