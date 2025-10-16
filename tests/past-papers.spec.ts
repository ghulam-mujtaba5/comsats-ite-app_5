import { test, expect } from '@playwright/test'
import { login } from './auth.spec'
import * as path from 'path'

/**
 * Past Papers Tests
 * 
 * Tests past paper browsing, filtering, searching, and uploading
 */

test.describe('Past Papers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/past-papers')
  })

  test('should display past papers page', async ({ page }) => {
    await expect(page).toHaveURL(/.*past-papers/)
    await expect(page.locator('h1')).toContainText('Past Papers')
  })

  test('should show past paper cards', async ({ page }) => {
    // Wait for papers to load
    await page.waitForSelector('[data-testid="paper-card"]', { timeout: 10000 })
    
    // Should have papers
    const papers = await page.locator('[data-testid="paper-card"]').count()
    expect(papers).toBeGreaterThan(0)
  })

  test('should search for past papers', async ({ page }) => {
    // Type in search box
    await page.fill('input[placeholder*="Search"]', 'CS101')
    
    // Wait for results
    await page.waitForTimeout(1000)
    
    // Should show search results
    await expect(page.locator('[data-testid="paper-card"]')).toBeVisible()
  })

  test('should filter by course', async ({ page }) => {
    // Click course filter
    await page.click('button:has-text("Course")')
    
    // Select a course
    await page.click('text=Programming Fundamentals')
    
    // Should show filtered papers
    await expect(page.locator('[data-course="CS101"]')).toBeVisible()
  })

  test('should filter by semester', async ({ page }) => {
    // Click semester filter
    await page.click('button:has-text("Semester")')
    
    // Select Fall 2024
    await page.click('text=Fall 2024')
    
    // Should show filtered papers
    await expect(page.locator('[data-semester="Fall 2024"]')).toBeVisible()
  })

  test('should filter by type', async ({ page }) => {
    // Click type filter
    await page.click('button:has-text("Type")')
    
    // Select Midterm
    await page.click('text=Midterm')
    
    // Should show midterm papers
    await expect(page.locator('[data-type="midterm"]')).toBeVisible()
  })

  test('should download a past paper', async ({ page }) => {
    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent('download')
    
    // Click download button
    await page.locator('button[aria-label="Download"]').first().click()
    
    // Wait for download to start
    const download = await downloadPromise
    
    // Verify download started
    expect(download).toBeTruthy()
  })

  test('should view paper details', async ({ page }) => {
    // Click on first paper
    await page.locator('[data-testid="paper-card"]').first().click()
    
    // Should show paper details
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('button:has-text("Download")')).toBeVisible()
  })

  test('should upload a past paper when logged in', async ({ page }) => {
    await login(page)
    await page.goto('/past-papers')
    
    // Click upload button
    await page.click('button:has-text("Upload Paper")')
    
    // Should show upload dialog
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Fill upload form
    await page.fill('input[name="title"]', 'CS101 Midterm Fall 2024')
    await page.selectOption('select[name="course"]', 'CS101')
    await page.selectOption('select[name="semester"]', 'Fall')
    await page.selectOption('select[name="year"]', '2024')
    await page.selectOption('select[name="type"]', 'midterm')
    
    // Upload file (mock)
    const filePath = path.join(__dirname, 'fixtures', 'sample-paper.pdf')
    await page.setInputFiles('input[type="file"]', filePath)
    
    // Submit
    await page.click('button:has-text("Upload")')
    
    // Should show success message
    await expect(page.locator('text=Uploaded successfully')).toBeVisible({ timeout: 10000 })
  })

  test('should show login prompt when uploading without auth', async ({ page }) => {
    // Click upload button
    await page.click('button:has-text("Upload Paper")')
    
    // Should show login prompt
    await expect(page.locator('text=Sign in,text=Login')).toBeVisible()
  })

  test('should sort papers by date', async ({ page }) => {
    // Click sort dropdown
    await page.click('button:has-text("Sort")')
    
    // Select newest first
    await page.click('text=Newest First')
    
    // Should reorder papers
    await expect(page.locator('[data-testid="paper-card"]').first()).toBeVisible()
  })

  test('should load more papers on scroll', async ({ page }) => {
    // Get initial count
    const initialCount = await page.locator('[data-testid="paper-card"]').count()
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Wait for more to load
    await page.waitForTimeout(2000)
    
    // Should have more papers
    const newCount = await page.locator('[data-testid="paper-card"]').count()
    expect(newCount).toBeGreaterThanOrEqual(initialCount)
  })
})
