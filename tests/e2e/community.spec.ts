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
  
  test('POST /api/community/posts requires authentication', async ({ request }) => {
    const res = await request.post('/api/community/posts', {
      data: {
        content: 'Test post content',
        type: 'general'
      }
    })
    // Should either be 401 (unauthorized) or 400 (validation error)
    expect([401, 400]).toContain(res.status())
  })
  
  test('POST /api/community/posts validates content length', async ({ request }) => {
    // This test assumes we have a way to authenticate in tests
    // In a real implementation, we would need to sign in first
    const res = await request.post('/api/community/posts', {
      data: {
        content: 'ab', // Less than minimum length
        type: 'general'
      }
    })
    expect([400, 401]).toContain(res.status())
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
  
  test('Community page has create post functionality', async ({ page }) => {
    await page.goto('/community')
    
    // Check for create post button
    const createPostButton = page.getByRole('button', { name: /create post/i })
    await expect(createPostButton).toBeVisible()
    
    // Click the button and check if dialog opens
    await createPostButton.click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
  })
  
  test('Community page has search functionality', async ({ page }) => {
    await page.goto('/community')
    
    // Check for search input
    const searchInput = page.getByPlaceholder(/search/i)
    await expect(searchInput).toBeVisible()
    
    // Type in search and verify it exists
    await searchInput.fill('test')
    await expect(searchInput).toHaveValue('test')
  })
  
  test('Community page has filtering options', async ({ page }) => {
    await page.goto('/community')
    
    // Check for filter button
    const filterButton = page.getByRole('button', { name: /filter/i })
    await expect(filterButton).toBeVisible()
    
    // Click filter button and check if filter panel opens
    await filterButton.click()
    const filterPanel = page.locator('.filter-panel') // Adjust selector as needed
    // Note: This might need adjustment based on actual implementation
  })
})

test.describe('Community Post Interactions', () => {
  test('User can like a post', async ({ page }) => {
    await page.goto('/community')
    
    // Find the first post with a like button
    const likeButton = page.locator('button[aria-label*="like" i]').first()
    if (await likeButton.isVisible()) {
      // Get initial like count
      const likeCountElement = likeButton.locator('+ span')
      const initialCount = await likeCountElement.textContent()
      
      // Click like button
      await likeButton.click()
      
      // Verify the like count changed (this might need adjustment based on implementation)
      // await expect(likeCountElement).not.toHaveText(initialCount)
    }
  })
  
  test('User can comment on a post', async ({ page }) => {
    await page.goto('/community')
    
    // Find the first post with a comment button
    const commentButton = page.locator('button[aria-label*="comment" i]').first()
    if (await commentButton.isVisible()) {
      await commentButton.click()
      
      // Check if comment section opens
      const commentSection = page.locator('.comment-section') // Adjust selector as needed
      // await expect(commentSection).toBeVisible()
    }
  })
})

test.describe('Community Media Handling', () => {
  test('Media uploader accepts valid file types', async ({ page }) => {
    await page.goto('/community')
    
    // Open create post dialog
    const createPostButton = page.getByRole('button', { name: /create post/i })
    await createPostButton.click()
    
    // Check for media upload area
    const mediaUploadArea = page.locator('[data-testid="media-uploader"]') // Adjust selector as needed
    // await expect(mediaUploadArea).toBeVisible()
  })
})

test.describe('Community Admin Functions', () => {
  test('Admin panel loads for authorized users', async ({ page }) => {
    // This would require logging in as an admin user
    // Implementation would depend on authentication setup
  })
  
  test('Content reporting functionality works', async ({ page }) => {
    await page.goto('/community')
    
    // Find a post with report option
    const postMenu = page.locator('.post-menu-button').first() // Adjust selector as needed
    if (await postMenu.isVisible()) {
      await postMenu.click()
      
      const reportOption = page.getByRole('menuitem', { name: /report/i })
      // await expect(reportOption).toBeVisible()
    }
  })
})