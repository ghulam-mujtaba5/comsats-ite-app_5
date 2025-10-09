# Automatic Campus and Department Detection Features

## Overview
This document describes the implementation of automatic campus and department detection based on user email addresses for the COMSATS community platform.

## Features Implemented

### 1. Email Domain Mapping
- Created mapping of email domains to campus codes
- Supports all 8 COMSATS campuses:
  - Lahore: `cuilahore.edu.pk` → `LHR`
  - Islamabad: `comsats.edu.pk` → `ISB`
  - Abbottabad: `cuiatd.edu.pk` → `ATK`
  - Attock: `cuiatk.edu.pk` → `ATK2`
  - Sahiwal: `cuisahiwal.edu.pk` → `SWL`
  - Vehari: `cuivehari.edu.pk` → `VEH`
  - Wah: `wah.comsats.edu.pk` → `WAH`
  - Virtual: `virtual.comsats.edu.pk` → `VRT`

### 2. Department Detection
- Created mapping of email prefixes to department codes
- Supports all major departments:
  - Computer Science: `bse`, `bscs`, `mscs`, `phdcs` → `CS`
  - Software Engineering: `bsse` → `SE`
  - Electrical Engineering: `bsee`, `msee` → `EE`
  - And 15+ other departments

### 3. Automatic Preference Setting
- When a user logs in, their campus and department are automatically detected from their email
- User preferences are automatically updated in the database
- Works for both email/password login and Google OAuth

### 4. Default Filtering
- All community pages automatically filter content by the user's campus and department
- Users see content relevant to their specific academic group by default
- Batch filtering is also available for more specific grouping

## Technical Implementation

### Files Created/Modified

1. `lib/campus-email-mapping.ts` - Email domain to campus/department mappings
2. `lib/user-campus-detector.ts` - Functions to detect campus/department from email
3. `contexts/auth-context.tsx` - Added automatic preference detection on login
4. `contexts/campus-context.tsx` - Load user preferences on login

### How It Works

1. **User Login**: When a user logs in (email/password or Google OAuth)
2. **Email Analysis**: System analyzes the user's email address
3. **Campus Detection**: Extracts campus from email domain
4. **Department Detection**: Extracts department from email prefix
5. **Preference Update**: Automatically updates user preferences in database
6. **Content Filtering**: All community pages filter content by user's campus/department

### Example Email Processing

- Email: `bse2022001@cuilahore.edu.pk`
  - Campus: Lahore (`LHR`) from domain `cuilahore.edu.pk`
  - Department: Computer Science (`CS`) from prefix `bse`
  - Result: User automatically sees Lahore CS department content

- Email: `bsee2021005@cuiatd.edu.pk`
  - Campus: Abbottabad (`ATK`) from domain `cuiatd.edu.pk`
  - Department: Electrical Engineering (`EE`) from prefix `bsee`
  - Result: User automatically sees Abbottabad EE department content

## Benefits

1. **Seamless Experience**: Users automatically see relevant content without manual configuration
2. **Accurate Grouping**: Content is organized by actual academic groups
3. **Reduced Friction**: No need for users to manually select campus/department
4. **Scalable**: Works for all COMSATS campuses and departments
5. **Maintainable**: Easy to update mappings as needed

## Testing

The system has been tested with sample email addresses from all campuses and departments to ensure accurate detection.

## Future Enhancements

1. **Manual Override**: Allow users to manually change their campus/department if detection is incorrect
2. **Batch Detection**: Automatically detect batch from email patterns
3. **Program Detection**: Extract program information from email structure
4. **Admin Verification**: Allow admins to verify and correct user campus/department assignments

This implementation ensures that when any user logs in, they automatically see content relevant to their campus and department without any manual configuration.