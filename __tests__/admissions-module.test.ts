import { test, expect } from '@playwright/test'

test.describe('Admissions Module', () => {
  test('should load the main admissions page', async ({ page }) => {
    await page.goto('/admissions')
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Admissions - CampusAxis/)
    
    // Check for key elements
    await expect(page.getByText('Your Path to COMSATS')).toBeVisible()
    await expect(page.getByText('Peer-to-Peer Mentoring')).toBeVisible()
    await expect(page.getByText('Study Resources')).toBeVisible()
    await expect(page.getByText('Entrance Exam Preparation')).toBeVisible()
  })

  test('should navigate between tabs', async ({ page }) => {
    await page.goto('/admissions')
    
    // Click on Find Mentors tab
    await page.getByRole('tab', { name: 'Find Mentors' }).click()
    await expect(page.getByText('Find Your Mentor')).toBeVisible()
    
    // Click on Resources tab
    await page.getByRole('tab', { name: 'Resources' }).click()
    await expect(page.getByText('Study Resources')).toBeVisible()
    
    // Click on Exam Prep tab
    await page.getByRole('tab', { name: 'Exam Prep' }).click()
    await expect(page.getByText('Merit Calculator')).toBeVisible()
  })

  test('should display mentor cards', async ({ page }) => {
    await page.goto('/admissions')
    await page.getByRole('tab', { name: 'Find Mentors' }).click()
    
    // Check that mentor cards are displayed
    const mentorCards = page.locator('[data-testid="mentor-card"]')
    await expect(mentorCards.first()).toBeVisible()
  })

  test('should display resource cards', async ({ page }) => {
    await page.goto('/admissions')
    await page.getByRole('tab', { name: 'Resources' }).click()
    
    // Check that resource cards are displayed
    const resourceCards = page.locator('[data-testid="resource-card"]')
    await expect(resourceCards.first()).toBeVisible()
  })

  test('should calculate merit score', async ({ page }) => {
    await page.goto('/admissions')
    await page.getByRole('tab', { name: 'Exam Prep' }).click()
    
    // Fill in merit calculator form
    await page.getByLabel('Matric Percentage').fill('85')
    await page.getByLabel('Intermediate Percentage').fill('80')
    await page.getByRole('button', { name: 'Calculate Merit' }).click()
    
    // Check that result is displayed
    await expect(page.getByText('Based on the provided scores')).toBeVisible()
  })
})