import { test, expect } from '@playwright/test'

test.describe('Alumni Portal', () => {
  test('Alumni portal page loads correctly', async ({ page }) => {
    await page.goto('/alumni')
    
    // Check that the alumni portal heading is visible
    await expect(page.getByText(/Alumni Portal/i)).toBeVisible({ timeout: 15000 })
    
    // Check that the email management section is visible
    await expect(page.getByText(/Email Management/i)).toBeVisible()
    
    // Check that the alumni benefits section is visible
    await expect(page.getByText(/Alumni Benefits/i)).toBeVisible()
  })
  
  test('Alumni portal navigation works', async ({ page }) => {
    await page.goto('/alumni')
    
    // Check navigation to profile page
    await page.click('text=Profile')
    await expect(page).toHaveURL(/.*\/alumni\/profile/)
    await expect(page.getByText(/Your Profile/i)).toBeVisible()
    
    // Navigate back to dashboard
    await page.goto('/alumni')
    
    // Check navigation to settings page
    await page.click('text=Settings')
    await expect(page).toHaveURL(/.*\/alumni\/settings/)
    await expect(page.getByText(/Account Settings/i)).toBeVisible()
  })
  
  test('Alumni portal has proper glassmorphism design', async ({ page }) => {
    await page.goto('/alumni')
    
    // Check that the page has glassmorphism elements
    const glassCards = page.locator('.glass-card-premium')
    const count = await glassCards.count()
    expect(count).toBeGreaterThan(0)
    
    // Check that there are animated background elements
    const animatedElements = page.locator('.float')
    const animatedCount = await animatedElements.count()
    expect(animatedCount).toBeGreaterThan(0)
  })
  
  test('Profile page loads with form elements', async ({ page }) => {
    await page.goto('/alumni/profile')
    
    // Check that profile form elements exist
    await expect(page.getByLabel(/Full Name/i)).toBeVisible()
    await expect(page.getByLabel(/Phone Number/i)).toBeVisible()
    await expect(page.getByLabel(/Address/i)).toBeVisible()
    
    // Check that professional information section exists
    await expect(page.getByText(/Professional Information/i)).toBeVisible()
    
    // Check that academic information section exists
    await expect(page.getByText(/Academic Information/i)).toBeVisible()
  })
  
  test('Settings page loads with preference options', async ({ page }) => {
    await page.goto('/alumni/settings')
    
    // Check that notification preferences section exists
    await expect(page.getByText(/Notification Preferences/i)).toBeVisible()
    
    // Check that privacy settings section exists
    await expect(page.getByText(/Privacy Settings/i)).toBeVisible()
    
    // Check that security settings section exists
    await expect(page.getByText(/Security Settings/i)).toBeVisible()
    
    // Check that account management section exists
    await expect(page.getByText(/Account Management/i)).toBeVisible()
  })
})