# Campus OAuth Validation Implementation

## Overview
This implementation ensures that when a user logs in or signs up using Google OAuth, the system validates that the email domain matches the selected campus domain. For example, if a user selects Lahore campus, their email must be from `@cuilahore.edu.pk`.

## Changes Made

### 1. Updated `lib/auth.ts`
- Added `validateEmailDomainForCampus` function to validate that an email domain matches the expected campus domain
- Enhanced existing functions with better documentation

### 2. Updated `contexts/auth-context.tsx`
- Modified `loginWithGoogle` function to pass the selected campus code in the OAuth redirect URL
- Added import for `useCampus` hook to access the selected campus

### 3. Updated `app/auth/callback/route.ts`
- Modified OAuth callback to validate the email domain against the selected campus
- Added campus code parameter extraction from the redirect URL
- Implemented campus mismatch validation that signs out the user and redirects with an error if validation fails
- Added appropriate error handling and user feedback

### 4. Updated `app/auth/auth-client.tsx`
- Added handling for the new `campus_mismatch` error
- Users will now see a specific error message when their email domain doesn't match their selected campus

### 5. Updated `components/auth/login-form.tsx`
- Added visual indication of the currently selected campus during Google sign-in
- Users can now see which campus they have selected before signing in

### 6. Updated `components/layout/campus-selector.tsx`
- Added guidance text in the campus selection dialog about the importance of selecting the correct campus for Google sign-in

### 7. Added `__tests__/auth-campus-validation.test.ts`
- Created unit tests for the new validation functions
- Tests cover valid and invalid email formats
- Tests cover campus domain validation scenarios

## How It Works

1. When a user selects a campus, that campus code is stored in the application context
2. When the user clicks "Continue with Google", the selected campus code is passed in the OAuth redirect URL
3. After successful OAuth authentication, the callback validates:
   - That the email is a valid COMSATS format
   - That the email domain matches the selected campus domain
4. If validation fails, the user is signed out and redirected with an appropriate error message

## Validation Rules

- Email must follow the format: `<term><yy>-<program>-<roll>@<campus-domain>`
- Email domain must match the selected campus domain
- Valid campus domains include:
  - `cuilahore.edu.pk` (Lahore - LHR)
  - `cuislamabad.edu.pk` (Islamabad - ISB)
  - `cuiabbottabad.edu.pk` (Abbottabad - ABD)
  - `cuiattock.edu.pk` (Attock - ATK)
  - `cuisahiwal.edu.pk` (Sahiwal - SWL)
  - `cuivehari.edu.pk` (Vehari - VEH)
  - `cuiwah.edu.pk` (Wah - WAH)
  - `comsats.edu.pk` (Virtual Campus - VRT)

## Error Messages

- `invalid_domain`: Email doesn't match the required COMSATS format
- `campus_mismatch`: Email domain doesn't match the selected campus
- `callback_error`: General OAuth error

## Testing

Unit tests have been added to verify the validation functions work correctly. Tests cover:
- Valid email formats
- Invalid email formats
- Correct campus domain matching
- Incorrect campus domain matching
- Edge cases and invalid inputs