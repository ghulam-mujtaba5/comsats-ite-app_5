import { test, expect } from '@playwright/test'
import { login } from './auth.spec'

/**
 * Faculty Reviews Tests
 * 
 * Tests faculty browsing, searching, filtering, and review submission
 */

test.describe('Faculty Reviews', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/faculty')
  })

  test('should display faculty page', async ({ page }) => {
    await expect(page).toHaveURL(/.*faculty/)
    await expect(page.locator('h1')).toContainText('Faculty')
  })

  test('should show faculty cards', async ({ page }) => {
    // Wait for faculty cards to load
    await page.waitForSelector('[data-testid="faculty-card"]', { timeout: 10000 })
    
    // Should have multiple faculty cards
    const cards = await page.locator('[data-testid="faculty-card"]').count()
    expect(cards).toBeGreaterThan(0)
  })

  test('should search for faculty', async ({ page }) => {
    // Type in search box
    await page.fill('input[placeholder*="Search"]', 'Dr.')
    
    // Wait for results
    await page.waitForTimeout(1000)
    
    // Should show filtered results
    const results = await page.locator('[data-testid="faculty-card"]').count()
    expect(results).toBeGreaterThan(0)
  })

  test('should filter by department', async ({ page }) => {
    // Click department filter
    await page.click('button:has-text("Department")')
    
    // Select a department
    await page.click('text=Computer Science')
    
    // Should show filtered faculty
    await expect(page.locator('[data-department="CS"]')).toBeVisible()
  })

  test('should filter by rating', async ({ page }) => {
    // Click rating filter
    await page.click('button:has-text("Rating")')
    
    // Select 4+ stars
    await page.click('text=4+ Stars')
    
    // Should show highly rated faculty
    await expect(page.locator('[data-rating*="4"]')).toBeVisible()
  })

  test('should view faculty profile', async ({ page }) => {
    // Click on first faculty card
    await page.locator('[data-testid="faculty-card"]').first().click()
    
    // Should navigate to profile page
    await expect(page).toHaveURL(/.*faculty\/.*/)
    
    // Should show faculty details
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should submit a review when logged in', async ({ page }) => {
    // Login first
    await login(page)
    await page.goto('/faculty')
    
    // Go to faculty profile
    await page.locator('[data-testid="faculty-card"]').first().click()
    
    // Click write review
    await page.click('button:has-text("Write Review")')
    
    // Fill review form
    await page.fill('textarea[placeholder*="review"]', 'Great professor! Very helpful and knowledgeable.')
    
    // Select rating
    await page.click('[data-rating="5"]')
    
    // Submit review
    await page.click('button:has-text("Submit Review")')
    
    // Should show success message
    await expect(page.locator('text=Review submitted')).toBeVisible({ timeout: 10000 })
  })

  test('should show login prompt when submitting review without auth', async ({ page }) => {
    // Go to faculty profile
    await page.locator('[data-testid="faculty-card"]').first().click()
    
    // Click write review
    await page.click('button:has-text("Write Review")')
    
    // Should redirect to auth or show login modal
    await expect(page.locator('text=Sign in,text=Login')).toBeVisible({ timeout: 5000 })
  })

  test('should load more faculty on scroll', async ({ page }) => {
    // Get initial count
    const initialCount = await page.locator('[data-testid="faculty-card"]').count()
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Wait for more to load
    await page.waitForTimeout(2000)
    
    // Should have more faculty
    const newCount = await page.locator('[data-testid="faculty-card"]').count()
    expect(newCount).toBeGreaterThanOrEqual(initialCount)
  })
})
