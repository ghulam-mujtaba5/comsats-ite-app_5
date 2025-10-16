import { test, expect } from '@playwright/test'
import { login } from './auth.spec'

/**
 * Community Features Tests
 * 
 * Tests community posting, commenting, reactions, and interactions
 */

test.describe('Community Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page)
    await page.goto('/community')
  })

  test('should display community page', async ({ page }) => {
    await expect(page).toHaveURL(/.*community/)
    await expect(page.locator('h1')).toContainText('Community')
  })

  test('should show create post button', async ({ page }) => {
    await expect(page.locator('button:has-text("Create Post")')).toBeVisible()
  })

  test('should open create post dialog', async ({ page }) => {
    await page.click('button:has-text("Create Post")')
    
    // Should show dialog
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('text=Create a Post')).toBeVisible()
  })

  test('should create a text post successfully', async ({ page }) => {
    await page.click('button:has-text("Create Post")')
    
    // Fill post form
    const postTitle = `Test Post ${Date.now()}`
    const postContent = 'This is a test post created by Playwright'
    
    await page.fill('input[placeholder*="title"]', postTitle)
    await page.fill('textarea', postContent)
    
    // Submit post
    await page.click('button:has-text("Post")')
    
    // Should show success message
    await expect(page.locator('text=Posted successfully')).toBeVisible({ timeout: 10000 })
    
    // Should see the post in feed
    await expect(page.locator(`text=${postTitle}`)).toBeVisible({ timeout: 10000 })
  })

  test('should filter posts by category', async ({ page }) => {
    // Click on a category filter
    await page.click('button:has-text("Academic")')
    
    // Should show filtered posts
    await expect(page.locator('[data-category="academic"]')).toBeVisible()
  })

  test('should search posts', async ({ page }) => {
    // Type in search box
    await page.fill('input[placeholder*="Search"]', 'test')
    await page.press('input[placeholder*="Search"]', 'Enter')
    
    // Should show search results
    await expect(page.locator('text=Search Results')).toBeVisible()
  })

  test('should like a post', async ({ page }) => {
    // Wait for posts to load
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 })
    
    // Get initial like count
    const likeButton = page.locator('[data-testid="like-button"]').first()
    const initialLikes = await likeButton.locator('text=/\\d+/').textContent()
    
    // Click like
    await likeButton.click()
    
    // Should increment like count
    await expect(likeButton).not.toContainText(initialLikes || '0')
  })

  test('should comment on a post', async ({ page }) => {
    // Click on first post
    await page.locator('[data-testid="post-card"]').first().click()
    
    // Should navigate to post details
    await expect(page).toHaveURL(/.*community\/post\/.*/)
    
    // Write comment
    const comment = `Test comment ${Date.now()}`
    await page.fill('textarea[placeholder*="comment"]', comment)
    
    // Submit comment
    await page.click('button:has-text("Comment")')
    
    // Should show comment
    await expect(page.locator(`text=${comment}`)).toBeVisible({ timeout: 10000 })
  })

  test('should reply to a comment', async ({ page }) => {
    // Go to post with comments
    await page.locator('[data-testid="post-card"]').first().click()
    
    // Click reply on first comment
    await page.locator('button:has-text("Reply")').first().click()
    
    // Write reply
    const reply = `Test reply ${Date.now()}`
    await page.fill('textarea[placeholder*="reply"]', reply)
    
    // Submit reply
    await page.click('button:has-text("Send")')
    
    // Should show reply
    await expect(page.locator(`text=${reply}`)).toBeVisible({ timeout: 10000 })
  })

  test('should create a poll', async ({ page }) => {
    await page.click('button:has-text("Create Post")')
    
    // Switch to poll tab
    await page.click('text=Poll')
    
    // Fill poll form
    await page.fill('input[placeholder*="question"]', 'Test Poll Question?')
    await page.fill('input[placeholder*="Option 1"]', 'Option A')
    await page.fill('input[placeholder*="Option 2"]', 'Option B')
    
    // Submit poll
    await page.click('button:has-text("Create Poll")')
    
    // Should show success
    await expect(page.locator('text=Poll created')).toBeVisible({ timeout: 10000 })
  })

  test('should vote on a poll', async ({ page }) => {
    // Find a poll
    const poll = page.locator('[data-testid="poll-card"]').first()
    
    if (await poll.isVisible()) {
      // Click on first option
      await poll.locator('[data-testid="poll-option"]').first().click()
      
      // Should show vote confirmation
      await expect(poll.locator('text=Voted')).toBeVisible()
    }
  })

  test('should share a post', async ({ page }) => {
    // Click share on first post
    await page.locator('button[aria-label="Share"]').first().click()
    
    // Should show share dialog
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('text=Share')).toBeVisible()
  })

  test('should bookmark a post', async ({ page }) => {
    // Click bookmark on first post
    const bookmarkButton = page.locator('button[aria-label="Bookmark"]').first()
    await bookmarkButton.click()
    
    // Should show bookmark confirmation
    await expect(page.locator('text=Bookmarked')).toBeVisible()
  })

  test('should report inappropriate content', async ({ page }) => {
    // Click more options
    await page.locator('button[aria-label="More options"]').first().click()
    
    // Click report
    await page.click('text=Report')
    
    // Should show report dialog
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('text=Report')).toBeVisible()
    
    // Select reason
    await page.click('text=Spam')
    
    // Submit report
    await page.click('button:has-text("Submit Report")')
    
    // Should show confirmation
    await expect(page.locator('text=Report submitted')).toBeVisible()
  })

  test('should load more posts on scroll', async ({ page }) => {
    // Get initial post count
    const initialCount = await page.locator('[data-testid="post-card"]').count()
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Wait for new posts to load
    await page.waitForTimeout(2000)
    
    // Should have more posts
    const newCount = await page.locator('[data-testid="post-card"]').count()
    expect(newCount).toBeGreaterThan(initialCount)
  })
})
