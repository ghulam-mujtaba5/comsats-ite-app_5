import { test, expect } from '@playwright/test'

// Set base URL for tests
test.use({ baseURL: 'http://localhost:3001' })

test.describe('Enhanced Homepage', () => {
  test('Homepage loads with enhanced components', async ({ page }) => {
    await page.goto('/')
    
    // Check that the enhanced hero section is visible
    await expect(page.getByText(/CampusAxis/i)).toBeVisible({ timeout: 15000 })
    
    // Check that the enhanced features section is visible
    await expect(page.getByText(/Academic Success/i)).toBeVisible()
    
    // Check that the enhanced community section is visible
    await expect(page.getByText(/Academic Community/i)).toBeVisible()
    
    // Check that the enhanced news section is visible
    await expect(page.getByText(/Latest News/i)).toBeVisible()
    
    // Check that the enhanced FAQ section is visible
    await expect(page.getByText(/Frequently Asked Questions/i)).toBeVisible()
    
    // Check that the enhanced coming soon section is visible
    await expect(page.getByText(/Beta Testing Area/i)).toBeVisible()
  })
  
  test('Enhanced hero section has interactive elements', async ({ page }) => {
    await page.goto('/')
    
    // Check for quick action buttons
    const quickActions = page.locator('[data-testid="quick-action"]')
    const count = await quickActions.count()
    expect(count).toBeGreaterThan(0)
    
    // Check for statistics display
    const stats = page.locator('[data-testid="stat-item"]')
    const statsCount = await stats.count()
    expect(statsCount).toBeGreaterThan(0)
  })
  
  test('Enhanced features section has feature cards', async ({ page }) => {
    await page.goto('/')
    
    // Check for feature cards
    const featureCards = page.locator('[data-testid="feature-card"]')
    const count = await featureCards.count()
    expect(count).toBeGreaterThan(0)
  })
  
  test('Enhanced community section has community cards', async ({ page }) => {
    await page.goto('/')
    
    // Check for community cards
    const communityCards = page.locator('[data-testid="community-card"]')
    // Wait for cards to load
    await expect(communityCards.first()).toBeVisible({ timeout: 10000 })
  })
  
  test('Enhanced news section displays news items', async ({ page }) => {
    await page.goto('/')
    
    // Check for news cards
    const newsCards = page.locator('[data-testid="news-card"]')
    // Wait for cards to load
    await expect(newsCards.first()).toBeVisible({ timeout: 10000 })
  })
  
  test('Enhanced FAQ section has searchable FAQs', async ({ page }) => {
    await page.goto('/')
    
    // Check for FAQ search input
    const searchInput = page.getByPlaceholder(/search for questions/i)
    await expect(searchInput).toBeVisible()
    
    // Type in search and verify it exists
    await searchInput.fill('past papers')
    await expect(searchInput).toHaveValue('past papers')
  })
  
  test('Enhanced coming soon section has feature cards', async ({ page }) => {
    await page.goto('/')
    
    // Check for beta feature cards
    const featureCards = page.locator('[data-testid="beta-feature-card"]')
    const count = await featureCards.count()
    expect(count).toBeGreaterThan(0)
  })
  
  test('All enhanced sections have proper animations', async ({ page }) => {
    await page.goto('/')
    
    // Check that sections have animation classes
    const sections = page.locator('.glass-hero')
    const count = await sections.count()
    expect(count).toBeGreaterThan(0)
  })
})