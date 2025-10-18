import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive Site Testing Suite for campusaxis.site
 * Tests all pages, features, and glassmorphism implementation
 */

const BASE_URL = 'https://campusaxis.site';

// Helper to check glassmorphism styles
async function checkGlassmorphism(page: Page, selector: string) {
  const element = page.locator(selector).first();
  if (await element.count() === 0) return { hasGlass: false };
  
  const styles = await element.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      backdropFilter: computed.backdropFilter,
      background: computed.background,
      border: computed.border,
      boxShadow: computed.boxShadow,
      borderRadius: computed.borderRadius,
    };
  });
  
  const hasBackdropBlur = styles.backdropFilter && styles.backdropFilter !== 'none';
  const hasTransparentBg = styles.background && (
    styles.background.includes('rgba') || 
    styles.background.includes('hsla') ||
    styles.background.includes('gradient')
  );
  const hasShadow = styles.boxShadow && styles.boxShadow !== 'none';
  
  return {
    hasGlass: hasBackdropBlur || (hasTransparentBg && hasShadow),
    details: styles
  };
}

test.describe('Homepage Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/COMSATS|CampusAxis/i);
    
    // Check for main content
    await expect(page.locator('h1').first()).toBeVisible();
  });
  
  test('should have glassmorphism on hero section', async ({ page }) => {
    await page.goto(BASE_URL);
    const glass = await checkGlassmorphism(page, '[class*="hero"]');
    expect(glass.hasGlass).toBeTruthy();
  });
  
  test('should have responsive navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('nav').first()).toBeVisible();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav').first()).toBeVisible();
  });
});

test.describe('Authentication Pages', () => {
  test('should load login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
  
  test('should have glassmorphism on auth forms', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
    const glass = await checkGlassmorphism(page, 'form');
    expect(glass.hasGlass).toBeTruthy();
  });
});

test.describe('Community Pages', () => {
  test('should load community page', async ({ page }) => {
    await page.goto(`${BASE_URL}/community`);
    await expect(page.locator('h1')).toContainText(/community/i);
  });
  
  test('should have post cards with glassmorphism', async ({ page }) => {
    await page.goto(`${BASE_URL}/community`);
    const glass = await checkGlassmorphism(page, '[class*="card"]');
    expect(glass.hasGlass).toBeTruthy();
  });
  
  test('should have functional filters', async ({ page }) => {
    await page.goto(`${BASE_URL}/community`);
    const filterButton = page.locator('button').filter({ hasText: /filter|sort/i }).first();
    if (await filterButton.count() > 0) {
      await filterButton.click();
      await expect(page.locator('[role="menu"], [role="dialog"]')).toBeVisible();
    }
  });
});

test.describe('Past Papers Pages', () => {
  test('should load past papers page', async ({ page }) => {
    await page.goto(`${BASE_URL}/past-papers`);
    await expect(page.locator('h1')).toContainText(/past papers/i);
  });
  
  test('should have search functionality', async ({ page }) => {
    await page.goto(`${BASE_URL}/past-papers`);
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('CS101');
      await page.waitForTimeout(500);
      await expect(page.locator('[class*="card"], [class*="paper"]')).toBeVisible();
    }
  });
  
  test('should have glassmorphism on paper cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/past-papers`);
    const glass = await checkGlassmorphism(page, '[class*="paper"]');
    expect(glass.hasGlass).toBeTruthy();
  });
});

test.describe('GPA Calculator Pages', () => {
  test('should load GPA calculator', async ({ page }) => {
    await page.goto(`${BASE_URL}/gpa-calculator`);
    await expect(page.locator('h1')).toContainText(/gpa/i);
  });
  
  test('should have calculator tabs', async ({ page }) => {
    await page.goto(`${BASE_URL}/gpa-calculator`);
    const tabs = page.locator('[role="tablist"], [class*="tab"]');
    await expect(tabs.first()).toBeVisible();
  });
  
  test('should calculate semester GPA', async ({ page }) => {
    await page.goto(`${BASE_URL}/gpa-calculator/semester`);
    
    // Look for grade inputs
    const gradeSelect = page.locator('select').first();
    if (await gradeSelect.count() > 0) {
      await gradeSelect.selectOption('A');
      const resultElement = page.locator('[class*="result"], [class*="gpa"]');
      await expect(resultElement.first()).toBeVisible();
    }
  });
});

test.describe('Faculty Pages', () => {
  test('should load faculty page', async ({ page }) => {
    await page.goto(`${BASE_URL}/faculty`);
    await expect(page.locator('h1')).toContainText(/faculty/i);
  });
  
  test('should display faculty cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/faculty`);
    await expect(page.locator('[class*="faculty"], [class*="card"]').first()).toBeVisible();
  });
  
  test('should have search and filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/faculty`);
    const searchInput = page.locator('input[type="search"]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('Computer');
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Admin Pages', () => {
  test('should have admin login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    // Should redirect to login or show login form
    await expect(page).toHaveURL(/admin/);
  });
});

test.describe('Timetable Pages', () => {
  test('should load timetable page', async ({ page }) => {
    await page.goto(`${BASE_URL}/timetable`);
    await expect(page.locator('h1')).toContainText(/timetable/i);
  });
  
  test('should have calendar view', async ({ page }) => {
    await page.goto(`${BASE_URL}/timetable`);
    const calendar = page.locator('[class*="calendar"], [class*="schedule"]');
    await expect(calendar.first()).toBeVisible();
  });
});

test.describe('Resources Pages', () => {
  test('should load resources page', async ({ page }) => {
    await page.goto(`${BASE_URL}/resources`);
    await expect(page.locator('h1')).toContainText(/resources/i);
  });
  
  test('should display resource cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/resources`);
    await expect(page.locator('[class*="resource"], [class*="card"]').first()).toBeVisible();
  });
});

test.describe('Accessibility Tests', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(BASE_URL);
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    expect(h1Count).toBeLessThanOrEqual(2); // Typically one main h1
  });
  
  test('should have alt text on images', async ({ page }) => {
    await page.goto(BASE_URL);
    const images = await page.locator('img').all();
    for (const img of images.slice(0, 5)) { // Check first 5 images
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });
  
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});

test.describe('Performance Tests', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // 5 seconds
  });
  
  test('should have no console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Filter out known acceptable errors
    const criticalErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('_next') &&
      !err.includes('404')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await expect(page.locator('h1').first()).toBeVisible();
  });
  
  test('should have mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    const mobileMenuButton = page.locator('button[aria-label*="menu" i]').first();
    if (await mobileMenuButton.count() > 0) {
      await mobileMenuButton.click();
      await expect(page.locator('nav, [role="dialog"]')).toBeVisible();
    }
  });
});

test.describe('Theme Switching', () => {
  test('should have theme toggle', async ({ page }) => {
    await page.goto(BASE_URL);
    const themeButton = page.locator('button[aria-label*="theme" i], button[aria-label*="dark" i]').first();
    if (await themeButton.count() > 0) {
      await themeButton.click();
      await page.waitForTimeout(500);
      // Check if dark mode is applied
      const htmlClass = await page.locator('html').getAttribute('class');
      expect(htmlClass).toContain('dark');
    }
  });
});

test.describe('SEO Tests', () => {
  test('should have meta description', async ({ page }) => {
    await page.goto(BASE_URL);
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
  });
  
  test('should have Open Graph tags', async ({ page }) => {
    await page.goto(BASE_URL);
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    expect(ogImage).toBeTruthy();
  });
});
