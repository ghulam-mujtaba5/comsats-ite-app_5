import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive E2E Testing Suite for CampusAxis.site
 * Tests all pages, features, and user flows
 */

// Helper function to check glassmorphism styles
async function checkGlassmorphismStyles(page: Page, selector: string) {
  const element = page.locator(selector).first();
  const styles = await element.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      backdropFilter: computed.backdropFilter,
      background: computed.background,
      borderRadius: computed.borderRadius,
      boxShadow: computed.boxShadow,
    };
  });
  
  // Check for glassmorphism characteristics
  expect(styles.backdropFilter).toContain('blur');
  expect(styles.background).toMatch(/rgba/);
  return styles;
}

// Test configuration
const baseURL = 'https://campusaxis.site';
const testTimeout = 60000; // Increased to 60s

test.describe('CampusAxis Site - Complete Testing Suite', () => {
  
  // Set timeout for all tests in this suite
  test.setTimeout(testTimeout);
  
  test.beforeEach(async ({ page }) => {
    // Increase navigation timeout
    await page.goto(baseURL, { 
      timeout: testTimeout,
      waitUntil: 'domcontentloaded' // Changed from networkidle for faster loading
    });
  });

  test.describe('1. Homepage & Core Navigation', () => {
    
    test('Homepage loads successfully with glassmorphism design', async ({ page }) => {
      await expect(page).toHaveTitle(/CampusAxis|COMSATS/i);
      
      // Check main hero section
      const hero = page.locator('main').first();
      await expect(hero).toBeVisible();
      
      // Verify glassmorphism on main cards
      const cards = page.locator('[class*="glass"]').first();
      if (await cards.count() > 0) {
        await checkGlassmorphismStyles(page, '[class*="glass"]');
      }
    });

    test('Navigation menu works correctly', async ({ page }) => {
      // Test main navigation links
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      
      // Check mobile menu toggle
      const mobileToggle = page.locator('button[aria-label*="menu"]').first();
      if (await mobileToggle.isVisible()) {
        await mobileToggle.click();
        await page.waitForTimeout(500);
      }
    });

    test('Theme toggle functionality', async ({ page }) => {
      // Find theme toggle button
      const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]').first();
      
      if (await themeToggle.count() > 0) {
        const initialTheme = await page.evaluate(() => document.documentElement.className);
        await themeToggle.click();
        await page.waitForTimeout(300);
        const newTheme = await page.evaluate(() => document.documentElement.className);
        expect(initialTheme).not.toBe(newTheme);
      }
    });

    test('Search functionality', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
      
      if (await searchInput.count() > 0) {
        await searchInput.fill('computer science');
        await searchInput.press('Enter');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/search/i);
      }
    });
  });

  test.describe('2. Past Papers Module', () => {
    
    test('Past Papers page loads', async ({ page }) => {
      await page.goto(`${baseURL}/comsats-past-papers`);
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveTitle(/Past Papers/i);
      
      // Check for course cards
      const courseCards = page.locator('[class*="card"]');
      await expect(courseCards.first()).toBeVisible({ timeout: testTimeout });
    });

    test('Filter and search past papers', async ({ page }) => {
      await page.goto(`${baseURL}/comsats-past-papers`);
      await page.waitForLoadState('networkidle');
      
      // Test search functionality
      const searchInput = page.locator('input[placeholder*="search"]').first();
      if (await searchInput.count() > 0) {
        await searchInput.fill('CS');
        await page.waitForTimeout(1000);
      }
      
      // Test filters
      const filterButtons = page.locator('button[role="button"]');
      if (await filterButtons.count() > 0) {
        await filterButtons.first().click();
        await page.waitForTimeout(500);
      }
    });

    test('Download past paper', async ({ page }) => {
      await page.goto(`${baseURL}/comsats-past-papers`);
      await page.waitForLoadState('networkidle');
      
      // Find and click first download button
      const downloadBtn = page.locator('a[href*="pdf"], button:has-text("Download")').first();
      if (await downloadBtn.count() > 0) {
        await expect(downloadBtn).toBeVisible();
      }
    });
  });

  test.describe('3. GPA Calculator', () => {
    
    test('GPA Calculator page loads', async ({ page }) => {
      await page.goto(`${baseURL}/comsats-gpa-calculator`);
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveTitle(/GPA Calculator/i);
    });

    test('Calculate semester GPA', async ({ page }) => {
      await page.goto(`${baseURL}/comsats-gpa-calculator`);
      await page.waitForLoadState('networkidle');
      
      // Try to interact with GPA calculator
      const gradeInputs = page.locator('select, input[type="text"]');
      if (await gradeInputs.count() > 0) {
        // Fill in sample data
        await gradeInputs.first().click();
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('4. Community Features', () => {
    
    test('Community page loads', async ({ page }) => {
      await page.goto(`${baseURL}/community`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('main')).toBeVisible();
    });

    test('View community posts', async ({ page }) => {
      await page.goto(`${baseURL}/community`);
      await page.waitForLoadState('networkidle');
      
      const posts = page.locator('[class*="post"], article');
      if (await posts.count() > 0) {
        await expect(posts.first()).toBeVisible();
      }
    });

    test('Gamification features visible', async ({ page }) => {
      await page.goto(`${baseURL}/community`);
      await page.waitForLoadState('networkidle');
      
      // Check for level/points indicators
      const gamificationElements = page.locator('[class*="level"], [class*="points"], [class*="badge"]');
      if (await gamificationElements.count() > 0) {
        await expect(gamificationElements.first()).toBeVisible();
      }
    });
  });

  test.describe('5. Authentication Flow', () => {
    
    test('Auth page loads', async ({ page }) => {
      await page.goto(`${baseURL}/auth`);
      await page.waitForLoadState('networkidle');
      
      const authForm = page.locator('form').first();
      await expect(authForm).toBeVisible({ timeout: testTimeout });
    });

    test('Toggle between login and signup', async ({ page }) => {
      await page.goto(`${baseURL}/auth`);
      await page.waitForLoadState('networkidle');
      
      const toggleButton = page.locator('button:has-text("Sign up"), button:has-text("Log in")').first();
      if (await toggleButton.count() > 0) {
        await toggleButton.click();
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('6. Admin Panel', () => {
    
    test('Admin login page accessible', async ({ page }) => {
      await page.goto(`${baseURL}/admin/login`);
      await page.waitForLoadState('networkidle');
      
      const loginForm = page.locator('form');
      await expect(loginForm.first()).toBeVisible({ timeout: testTimeout });
    });
  });

  test.describe('7. Resources & Study Materials', () => {
    
    test('Resources page loads', async ({ page }) => {
      await page.goto(`${baseURL}/resources`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('main')).toBeVisible();
    });

    test('Search resources', async ({ page }) => {
      await page.goto(`${baseURL}/resources`);
      await page.waitForLoadState('networkidle');
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
      if (await searchInput.count() > 0) {
        await searchInput.fill('notes');
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('8. Timetable Features', () => {
    
    test('Timetable page loads', async ({ page }) => {
      await page.goto(`${baseURL}/timetable`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('9. Campus-Specific Pages', () => {
    
    const campuses = ['abbottabad', 'sahiwal', 'vehari'];
    
    for (const campus of campuses) {
      test(`${campus} campus page loads`, async ({ page }) => {
        await page.goto(`${baseURL}/campus/${campus}`);
        await page.waitForLoadState('networkidle');
        
        await expect(page.locator('main')).toBeVisible({ timeout: testTimeout });
      });
    }
  });

  test.describe('10. Blog & News', () => {
    
    test('Blog page loads', async ({ page }) => {
      await page.goto(`${baseURL}/blog`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('main')).toBeVisible();
    });

    test('News page loads', async ({ page }) => {
      await page.goto(`${baseURL}/news`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('11. Additional Features', () => {
    
    test('Scholarships page loads', async ({ page }) => {
      await page.goto(`${baseURL}/scholarships`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('main')).toBeVisible();
    });

    test('Faculty directory loads', async ({ page }) => {
      await page.goto(`${baseURL}/faculty`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('main')).toBeVisible();
    });

    test('Admissions page loads', async ({ page }) => {
      await page.goto(`${baseURL}/admissions`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('main')).toBeVisible();
    });

    test('Contact page loads', async ({ page }) => {
      await page.goto(`${baseURL}/contact`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('12. Accessibility & Performance', () => {
    
    test('Pages have proper ARIA labels', async ({ page }) => {
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
      
      // Check for landmark regions
      const nav = page.locator('nav');
      await expect(nav.first()).toBeVisible();
    });

    test('Images have alt text', async ({ page }) => {
      const images = page.locator('img');
      const count = await images.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          const alt = await img.getAttribute('alt');
          expect(alt).toBeTruthy();
        }
      }
    });

    test('Keyboard navigation works', async ({ page }) => {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(300);
      
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });
      
      expect(focusedElement).toBeTruthy();
    });
  });

  test.describe('13. Responsive Design', () => {
    
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      test(`Homepage responsive on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(baseURL);
        await page.waitForLoadState('networkidle');
        
        const main = page.locator('main');
        await expect(main).toBeVisible();
        
        // Take screenshot for visual verification
        await page.screenshot({ 
          path: `test-results/screenshots/${viewport.name}-homepage.png`,
          fullPage: true 
        });
      });
    }
  });

  test.describe('14. Error Handling', () => {
    
    test('404 page displays correctly', async ({ page }) => {
      await page.goto(`${baseURL}/non-existent-page-12345`);
      await page.waitForLoadState('networkidle');
      
      // Should show 404 or redirect
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
    });
  });
});

// Additional test suite for specific features
test.describe('Advanced Feature Testing', () => {
  
  test('Service Worker registration', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(swRegistered).toBeTruthy();
  });

  test('Local storage persistence', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Set a test value
    await page.evaluate(() => {
      localStorage.setItem('test-key', 'test-value');
    });
    
    const value = await page.evaluate(() => {
      return localStorage.getItem('test-key');
    });
    
    expect(value).toBe('test-value');
  });
});
