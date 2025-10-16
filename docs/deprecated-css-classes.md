# Deprecated CSS Classes to Remove

## Overview
This document lists all deprecated CSS classes that can be safely removed from `app/globals.css` since they are no longer used in the application after migrating to the new glassmorphism utility system.

## Legacy Glassmorphism Classes

### Direct Replacement Available
These classes have direct replacements in the new utility system:

1. `.glass-light` 
   - **Replacement**: `glass-subtle` utility
   - **Reason**: Part of the new 4-class system

2. `.glass-medium`
   - **Replacement**: `glass-secondary` utility
   - **Reason**: Part of the new 4-class system

3. `.glass-strong`
   - **Replacement**: `glass-primary` utility
   - **Reason**: Part of the new 4-class system

4. `.glass-premium`
   - **Replacement**: `glass-primary` utility with premium options
   - **Reason**: Part of the new 4-class system

5. `.glass-ultra`
   - **Replacement**: `glass-primary` utility with enhanced options
   - **Reason**: Part of the new 4-class system

6. `.glass-card`
   - **Replacement**: `glass-secondary` utility
   - **Reason**: Part of the new 4-class system

7. `.glass-card-premium`
   - **Replacement**: `glass-primary` utility with premium options
   - **Reason**: Part of the new 4-class system

8. `.glass-nav`
   - **Replacement**: `glass-primary` utility
   - **Reason**: Part of the new 4-class system

9. `.glass-modal`
   - **Replacement**: `glass-primary` utility
   - **Reason**: Part of the new 4-class system

10. `.glass-hero`
    - **Replacement**: `glass-primary` utility
    - **Reason**: Part of the new 4-class system

11. `.glass-button`
    - **Replacement**: Button component with glass variant
    - **Reason**: Component-based approach

### Unused Classes
These classes are not used anywhere in the application:

12. `.glass-noise`
    - **Usage**: None found
    - **Reason**: Deprecated pattern

13. `.glass-shimmer`
    - **Usage**: None found
    - **Reason**: Deprecated pattern

14. `.glass-hover`
    - **Usage**: None found
    - **Reason**: Deprecated pattern

15. `.glass-hover-glow`
    - **Usage**: None found
    - **Reason**: Deprecated pattern

16. `.glass-professional`
    - **Usage**: None found
    - **Reason**: Deprecated pattern

### Component-Based Replacements
These classes have been replaced by component-based implementations:

17. `.glass-floating`
    - **Replacement**: Component with floating variant
    - **Reason**: Component-based approach

18. `.glass-layered`
    - **Replacement**: Component with layered variant
    - **Reason**: Component-based approach

19. `.glass-gradient`
    - **Replacement**: Utility with gradient option
    - **Reason**: Utility-based approach

20. `.glass-depth`
    - **Replacement**: Utility with depth option
    - **Reason**: Utility-based approach

## Legacy Class Aliases Section
The entire `@layer components` section containing legacy class aliases can be removed:

```css
@layer components {
  .glass-light {
    /* ... */
  }
  
  :is(.dark .glass-light) {
    /* ... */
  }
  
  .glass-medium,
  .glass-card {
    /* ... */
  }
  
  /* ... all other legacy aliases ... */
}
```

## Verification
All UI components have been updated to use the new utility system:
- ✅ Alert component
- ✅ Button component
- ✅ Badge component
- ✅ Card component
- ✅ Dialog component
- ✅ Input component
- ✅ Popover component
- ✅ Select component
- ✅ Tabs component
- ✅ Textarea component
- ✅ Tooltip component

## Impact Assessment
Removing these classes will:
- ✅ Reduce CSS file size
- ✅ Improve maintainability
- ✅ Eliminate dead code
- ✅ Simplify the styling system
- ✅ Ensure consistency with the design system

## Rollback Plan
If any issues are discovered after removal:
1. Restore the backup of `globals.css`
2. Identify which specific class caused the issue
3. Re-add only that specific class
4. Investigate why the component wasn't properly updated