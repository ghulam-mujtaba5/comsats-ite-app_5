/**
 * Utility functions for testing responsive behavior
 */

// Common device breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  largeDesktop: 1440
} as const;

// Common device sizes for testing
export const DEVICE_SIZES = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
  largeDesktop: { width: 1440, height: 900 }
} as const;

// Simulate resizing the window
export function simulateResize(width: number, height: number) {
  if (typeof window !== 'undefined') {
    // Update window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height
    });
    
    // Dispatch resize event
    window.dispatchEvent(new Event('resize'));
  }
}

// Check if element is visible in viewport
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Check if element has proper touch target size (minimum 44px)
export function hasProperTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= 44 && rect.height >= 44;
}

// Check if text is readable (minimum font size 12px)
export function isTextReadable(element: HTMLElement): boolean {
  const computedStyle = window.getComputedStyle(element);
  const fontSize = parseFloat(computedStyle.fontSize);
  return fontSize >= 12;
}

// Check if layout is responsive
export function isLayoutResponsive(container: HTMLElement): boolean {
  const children = container.children;
  let isResponsive = true;
  
  // Check if grid layout adapts to screen size
  const computedStyle = window.getComputedStyle(container);
  if (computedStyle.display === 'grid') {
    // This is a simplified check - in a real test we would check actual grid behavior
    isResponsive = computedStyle.gridTemplateColumns !== 'none';
  }
  
  // Check if flex layout wraps on small screens
  if (computedStyle.display === 'flex') {
    // This is a simplified check - in a real test we would check actual flex behavior
    isResponsive = computedStyle.flexWrap !== 'nowrap';
  }
  
  return isResponsive;
}

// Test responsive behavior for a component
export async function testResponsiveComponent(
  component: HTMLElement,
  testName: string
): Promise<{ passed: boolean; issues: string[] }> {
  const issues: string[] = [];
  
  // Test on different screen sizes
  for (const [device, size] of Object.entries(DEVICE_SIZES)) {
    simulateResize(size.width, size.height);
    
    // Wait for any responsive changes to take effect
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if component is in viewport
    if (!isInViewport(component)) {
      issues.push(`Component not visible on ${device} screen`);
    }
    
    // Check touch targets for mobile devices
    if (device === 'mobile') {
      const interactiveElements = component.querySelectorAll('button, a, input');
      interactiveElements.forEach(el => {
        if (!hasProperTouchTarget(el as HTMLElement)) {
          issues.push(`Element ${el.tagName} has insufficient touch target size on mobile`);
        }
      });
    }
    
    // Check text readability
    const textElements = component.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
    textElements.forEach(el => {
      if (!isTextReadable(el as HTMLElement)) {
        issues.push(`Text element has insufficient font size on ${device} screen`);
      }
    });
  }
  
  return {
    passed: issues.length === 0,
    issues
  };
}