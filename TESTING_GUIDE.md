# Community Management System - Testing Guide

## Overview
This guide provides instructions for testing the Community Management System admin panel.

## Prerequisites
1. The application must be running locally
2. You must have admin credentials to access the admin panel

## Testing Steps

### 1. Access the Admin Panel
1. Navigate to `http://localhost:3006/admin/community` in your browser
2. Log in with admin credentials
3. Verify that the dashboard loads correctly

### 2. Test Dashboard Overview
1. Check that all statistics cards display data
2. Verify that the "Recent Posts" section shows posts
3. Confirm that "Pending Reports" shows any pending reports

### 3. Test Post Management
1. Click on the "Posts" tab
2. Verify that posts are displayed in the list
3. Test the search functionality by entering text in the search box
4. Test filtering by post status using the dropdown
5. Try hiding a post by clicking the eye icon
6. Try deleting a post by clicking the trash icon

### 4. Test User Management
1. Click on the "Users" tab
2. Verify that users are displayed in the list
3. Test the search functionality by entering text in the search box
4. Test filtering by user status using the dropdown
5. Try suspending a user by clicking the lock icon
6. Try banning a user by clicking the shield icon

### 5. Test Report Management
1. Click on the "Reports" tab
2. Verify that reports are displayed in the list
3. Test filtering by report status using the dropdown
4. Try resolving a report by clicking the checkmark icon
5. Try dismissing a report by clicking the X icon

### 6. Test Settings
1. Click on the "Settings" tab
2. Verify that all settings options are displayed
3. Try enabling/disabling features
4. Try adding blocked words

## Expected Results
- All tabs should load without errors
- Data should be displayed correctly in all sections
- Actions (hide, delete, suspend, ban, resolve, dismiss) should work properly
- Search and filter functionality should work as expected
- No console errors should appear in the browser developer tools

## Troubleshooting
If you encounter issues:
1. Check the browser console for error messages
2. Verify that the API endpoints are accessible
3. Ensure you have proper admin permissions
4. Check that the database is properly configured and accessible

## API Endpoints to Test
- `GET /api/admin/community/posts` - Should return a list of posts
- `PATCH /api/admin/community/posts` - Should update post status
- `GET /api/admin/community/users` - Should return a list of users
- `PATCH /api/admin/community/users` - Should update user status
- `GET /api/admin/community/reports` - Should return a list of reports
- `PATCH /api/admin/community/reports` - Should update report status

## Common Issues
1. **Unauthorized errors**: Ensure you're logged in with admin credentials
2. **No data displayed**: Check that the database has test data
3. **Actions not working**: Verify that the API endpoints are functioning correctly
4. **Search/filter not working**: Check browser console for JavaScript errors

## Success Criteria
- [ ] Dashboard loads without errors
- [ ] All tabs are accessible
- [ ] Data is displayed correctly
- [ ] All actions work properly
- [ ] Search and filter functionality works
- [ ] No console errors
- [ ] Responsive design works on different screen sizes