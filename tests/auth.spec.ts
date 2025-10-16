import { test, expect, type Page } from '@playwright/test'

/**
 * Authentication Flow Tests
 * 
 * Tests user registration, login, password reset, and session management
 */

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display login page', async ({ page }) => {
    await page.click('text=Login')
    await expect(page).toHaveURL(/.*auth/)
    await expect(page.locator('h1')).toContainText('Welcome Back')
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth')
    
    // Click login button without filling form
    await page.click('button:has-text("Sign In")')
    
    // Should show validation errors
    await expect(page.locator('text=required')).toBeVisible()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/auth')
    
    // Fill login form
    await page.fill('input[type="email"]', 'test@comsats.edu.pk')
    await page.fill('input[type="password"]', 'TestPassword123!')
    
    // Submit form
    await page.click('button:has-text("Sign In")')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 })
    
    // Should show welcome message
    await expect(page.locator('text=Welcome')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth')
    
    await page.fill('input[type="email"]', 'wrong@email.com')
    await page.fill('input[type="password"]', 'WrongPassword')
    
    await page.click('button:has-text("Sign In")')
    
    // Should show error message
    await expect(page.locator('text=Invalid')).toBeVisible()
  })

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/auth')
    
    await page.click('text=Sign Up')
    
    await expect(page).toHaveURL(/.*auth/)
    await expect(page.locator('h1')).toContainText('Create Account')
  })

  test('should register new user successfully', async ({ page }) => {
    await page.goto('/auth')
    await page.click('text=Sign Up')
    
    // Generate unique email
    const timestamp = Date.now()
    const email = `test${timestamp}@comsats.edu.pk`
    
    // Fill registration form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!')
    
    // Submit form
    await page.click('button:has-text("Create Account")')
    
    // Should show success message or redirect
    await expect(
      page.locator('text=Success,text=Account created,text=Check your email')
    ).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to password reset', async ({ page }) => {
    await page.goto('/auth')
    
    await page.click('text=Forgot Password')
    
    await expect(page).toHaveURL(/.*reset-password/)
    await expect(page.locator('h1')).toContainText('Reset Password')
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/auth')
    await page.fill('input[type="email"]', 'test@comsats.edu.pk')
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.click('button:has-text("Sign In")')
    
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 })
    
    // Logout
    await page.click('[aria-label="User menu"]')
    await page.click('text=Logout')
    
    // Should redirect to home
    await expect(page).toHaveURL('/')
  })
})

/**
 * Helper function to login
 */
async function login(page: Page, email: string = 'test@comsats.edu.pk', password: string = 'TestPassword123!') {
  await page.goto('/auth')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button:has-text("Sign In")')
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 })
}

// Export helper
export { login }
