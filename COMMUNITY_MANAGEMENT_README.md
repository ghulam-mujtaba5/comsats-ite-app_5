# Community Management System

## Overview
The Community Management System is a comprehensive admin panel for managing all aspects of the CampusAxis community platform. It provides administrators with tools to moderate content, manage users, handle reports, and monitor community engagement.

## Features

### 1. Dashboard Overview
- Real-time statistics on community engagement
- Total posts, active users, and pending reports
- Quick access to recent activity and pending actions

### 2. Post Management
- View all community posts with filtering options
- Hide, delete, or restore posts
- Search posts by content or author
- Filter by post status (active, hidden, deleted)
- View post details including likes, comments, and visibility settings

### 3. User Management
- View all community users with filtering options
- Suspend, ban, or activate user accounts
- Search users by name or email
- Filter by user status (active, suspended, banned)
- View user details including role, post count, and join date

### 4. Report Management
- Handle user-generated content reports
- Resolve or dismiss reports
- Filter by report status (pending, reviewed, resolved, dismissed)
- View report details including content type and reason

### 5. Settings
- Configure community platform policies
- Set up auto-moderation rules
- Manage blocked words
- Configure notification preferences

## API Endpoints

### Posts
- `GET /api/admin/community/posts` - Fetch all community posts
- `PATCH /api/admin/community/posts` - Update post status (hide, delete, restore)

### Users
- `GET /api/admin/community/users` - Fetch all community users
- `PATCH /api/admin/community/users` - Update user status (suspend, ban, activate)

### Reports
- `GET /api/admin/community/reports` - Fetch all community reports
- `PATCH /api/admin/community/reports` - Update report status (resolve, dismiss)

## Data Models

### CommunityPost
```typescript
interface CommunityPost {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
  likes: number
  comments: number
  visibility: string
  status: 'active' | 'hidden' | 'deleted'
  campus: string
  department: string
}
```

### CommunityUser
```typescript
interface CommunityUser {
  id: string
  name: string
  email: string
  role: string
  posts: number
  joinDate: string
  status: 'active' | 'suspended' | 'banned'
  avatar: string
}
```

### CommunityReport
```typescript
interface CommunityReport {
  id: string
  type: string
  content: string
  reporter: {
    id: string
    name: string
    avatar: string
  }
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdAt: string
  targetId: string
}
```

## Implementation Details

### Authentication
All API endpoints require admin authentication. Users must have the 'admin', 'super_admin', or 'moderator' role in the `admin_users` table.

### Database Schema
The system uses the following tables:
- `community_posts` - Stores all community posts
- `auth.users` - User authentication and basic info
- `user_profiles` - Extended user profile information
- `community_reports` - Content moderation reports
- `admin_users` - Admin user roles and permissions

### Security
- All API requests are validated for proper authentication
- Role-based access control ensures only authorized users can perform actions
- Input validation prevents malicious data from being processed

## Usage

### Accessing the Admin Panel
1. Navigate to `/admin/community` in the CampusAxis application
2. Log in with admin credentials
3. The dashboard will display an overview of community metrics

### Managing Posts
1. Go to the "Posts" tab
2. Use search and filters to find specific posts
3. Click the action buttons to hide, delete, or restore posts

### Managing Users
1. Go to the "Users" tab
2. Use search and filters to find specific users
3. Click the action buttons to suspend, ban, or activate users

### Handling Reports
1. Go to the "Reports" tab
2. Filter by report status to see pending reports
3. Click the action buttons to resolve or dismiss reports

## Error Handling
The system includes comprehensive error handling:
- Network errors are displayed to the user
- API errors are logged and appropriate messages are shown
- Invalid actions are prevented with validation

## Future Enhancements
- Advanced analytics and reporting
- User communication tools
- Automated moderation workflows
- Detailed audit logs
- Export functionality for reports and statistics