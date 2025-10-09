# Email Management Feature for Alumni Access

## Overview
This feature allows users to add multiple email addresses to their account, ensuring continued access after graduation when their institutional email may become inactive.

## Features Implemented

### 1. Database Schema
- Created `user_emails` table to store additional email addresses
- Supports three email types:
  - `primary`: Institutional email (from auth.users)
  - `secondary`: Backup institutional email
  - `personal`: Personal email for alumni access

### 2. API Endpoints
- `GET /api/user-emails` - Fetch all user email addresses
- `POST /api/user-emails` - Add a new email address
- `DELETE /api/user-emails?id={id}` - Remove an email address
- `POST /api/user-emails/set-primary` - Set an email as primary

### 3. UI Components
- Email management section in the profile page
- Ability to add/remove email addresses
- Set any verified email as primary

## How It Works

### For Current Students
1. Users can add secondary institutional emails or personal emails
2. All emails are stored in the `user_emails` table
3. Emails require verification before they can be set as primary

### For Alumni
1. After graduation, when institutional emails become inactive:
   - User logs in with their personal email
   - User goes to Profile → Email Management
   - User clicks "Set as Primary" on their personal email
   - User verifies the email address if required
2. The user can now access their account with their personal email

## Security Considerations
- Users can only manage their own email addresses
- Email verification is required before setting as primary
- Primary email cannot be deleted (must set another as primary first)
- All operations are protected by authentication

## Implementation Details

### Database Structure
```sql
CREATE TABLE user_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  email_type TEXT NOT NULL DEFAULT 'secondary',
  is_verified BOOLEAN DEFAULT false,
  verification_token UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, email),
  UNIQUE(email)
);
```

### API Endpoints

#### GET /api/user-emails
Returns all email addresses for the authenticated user, including the primary email from auth.users.

#### POST /api/user-emails
Adds a new email address to the user's account.
- Validates email format
- Ensures email uniqueness
- Sets initial verification status to false

#### DELETE /api/user-emails?id={id}
Removes an email address from the user's account.
- Prevents deletion of primary email
- Only allows deletion of user's own emails

#### POST /api/user-emails/set-primary
Sets an email address as the user's primary email.
- Verifies the email belongs to the user
- Ensures the email is verified
- Updates the user's primary email in auth.users
- Removes the email from user_emails table

## Future Enhancements
1. Email verification workflow with automated emails
2. Email conflict resolution (when email is already used by another account)
3. Bulk import of email addresses
4. Email usage analytics