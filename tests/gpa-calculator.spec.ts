import { test, expect } from '@playwright/test'
import { login } from './auth.spec'

/**
 * GPA Calculator Tests
 * 
 * Tests GPA calculation for semester, cumulative, aggregate, and planning
 */

test.describe('GPA Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gpa-calculator')
  })

  test('should display GPA calculator page', async ({ page }) => {
    await expect(page).toHaveURL(/.*gpa-calculator/)
    await expect(page.locator('h1')).toContainText('GPA Calculator')
  })

  test('should show calculator types', async ({ page }) => {
    // Should show all calculator options
    await expect(page.locator('text=Semester')).toBeVisible()
    await expect(page.locator('text=Cumulative')).toBeVisible()
    await expect(page.locator('text=Aggregate')).toBeVisible()
    await expect(page.locator('text=Planning')).toBeVisible()
  })

  test('should calculate semester GPA', async ({ page }) => {
    await page.goto('/gpa-calculator/semester')
    
    // Add first course
    await page.fill('input[name="course-name-0"]', 'Programming Fundamentals')
    await page.fill('input[name="credit-hours-0"]', '3')
    await page.selectOption('select[name="grade-0"]', 'A')
    
    // Add second course
    await page.click('button:has-text("Add Course")')
    await page.fill('input[name="course-name-1"]', 'Calculus I')
    await page.fill('input[name="credit-hours-1"]', '3')
    await page.selectOption('select[name="grade-1"]', 'B+')
    
    // Calculate GPA
    await page.click('button:has-text("Calculate")')
    
    // Should show result
    await expect(page.locator('[data-testid="gpa-result"]')).toBeVisible()
    await expect(page.locator('[data-testid="gpa-value"]')).toContainText(/\d\.\d+/)
  })

  test('should calculate cumulative GPA', async ({ page }) => {
    await page.goto('/gpa-calculator/cumulative')
    
    // Fill previous GPA
    await page.fill('input[name="previous-gpa"]', '3.5')
    await page.fill('input[name="previous-credits"]', '60')
    
    // Fill current semester
    await page.fill('input[name="current-gpa"]', '3.8')
    await page.fill('input[name="current-credits"]', '15')
    
    // Calculate
    await page.click('button:has-text("Calculate")')
    
    // Should show cumulative GPA
    await expect(page.locator('[data-testid="cgpa-result"]')).toBeVisible()
  })

  test('should calculate aggregate', async ({ page }) => {
    await page.goto('/gpa-calculator/aggregate')
    
    // Fill SSC marks
    await page.fill('input[name="ssc-obtained"]', '900')
    await page.fill('input[name="ssc-total"]', '1100')
    
    // Fill HSSC marks
    await page.fill('input[name="hssc-obtained"]', '950')
    await page.fill('input[name="hssc-total"]', '1100')
    
    // Fill entry test
    await page.fill('input[name="entry-test"]', '140')
    
    // Calculate
    await page.click('button:has-text("Calculate")')
    
    // Should show aggregate
    await expect(page.locator('[data-testid="aggregate-result"]')).toBeVisible()
  })

  test('should validate input fields', async ({ page }) => {
    await page.goto('/gpa-calculator/semester')
    
    // Try to calculate without filling form
    await page.click('button:has-text("Calculate")')
    
    // Should show validation errors
    await expect(page.locator('text=required,text=invalid')).toBeVisible()
  })

  test('should save calculation history when logged in', async ({ page }) => {
    await login(page)
    await page.goto('/gpa-calculator/semester')
    
    // Perform calculation
    await page.fill('input[name="course-name-0"]', 'Test Course')
    await page.fill('input[name="credit-hours-0"]', '3')
    await page.selectOption('select[name="grade-0"]', 'A')
    await page.click('button:has-text("Calculate")')
    
    // Should show save option
    await expect(page.locator('button:has-text("Save")')).toBeVisible()
    
    // Save calculation
    await page.click('button:has-text("Save")')
    
    // Should show success
    await expect(page.locator('text=Saved')).toBeVisible()
  })

  test('should reset form', async ({ page }) => {
    await page.goto('/gpa-calculator/semester')
    
    // Fill form
    await page.fill('input[name="course-name-0"]', 'Test Course')
    await page.fill('input[name="credit-hours-0"]', '3')
    
    // Click reset
    await page.click('button:has-text("Reset")')
    
    // Form should be empty
    await expect(page.locator('input[name="course-name-0"]')).toHaveValue('')
  })

  test('should show grade scale information', async ({ page }) => {
    // Click on grade scale info
    await page.click('[aria-label="Grade Scale"]')
    
    // Should show grade scale dialog
    await expect(page.locator('text=A = 4.0')).toBeVisible()
  })
})
