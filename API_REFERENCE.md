# API Reference

Complete documentation for all 104 API endpoints in the COMSATS ITE application.

## Table of Contents
- [Authentication](#authentication)
- [User Management](#user-management)
- [Community](#community)
- [Faculty Reviews](#faculty-reviews)
- [Past Papers](#past-papers)
- [GPA Calculator](#gpa-calculator)
- [News & Events](#news--events)
- [Notifications](#notifications)
- [Admin](#admin)

---

## Authentication

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@comsats.edu.pk",
  "password": "SecurePass123!",
  "department": "CS",
  "semester": 3
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john.doe@comsats.edu.pk"
  }
}
```

**Errors:**
- `400`: Invalid input data
- `409`: Email already exists

---

### POST /api/auth/login
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "john.doe@comsats.edu.pk",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john.doe@comsats.edu.pk",
    "role": "student"
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `400`: Missing fields

---

### POST /api/auth/logout
Terminate user session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /api/auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "john.doe@comsats.edu.pk"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### POST /api/auth/reset-password
Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset_token_123",
  "password": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## User Management

### GET /api/users/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john.doe@comsats.edu.pk",
  "department": "CS",
  "semester": 3,
  "avatar": "https://...",
  "bio": "Computer Science student...",
  "stats": {
    "posts": 42,
    "followers": 128,
    "following": 85
  }
}
```

---

### PATCH /api/users/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "bio": "Updated bio...",
  "avatar": "https://..."
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { /* updated user object */ }
}
```

---

### GET /api/users/:id
Get public profile of any user.

**Response (200):**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "department": "CS",
  "bio": "...",
  "stats": { /* public stats */ }
}
```

---

## Community

### GET /api/community/posts
Get paginated list of community posts.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `category` (optional: "discussion", "help", "announcement")
- `search` (optional: search query)
- `sortBy` (default: "recent", options: "recent", "popular", "trending")

**Response (200):**
```json
{
  "posts": [
    {
      "id": "post_123",
      "title": "Need help with DSA assignment",
      "content": "Can someone explain...",
      "author": {
        "id": "user_123",
        "name": "John Doe",
        "avatar": "https://..."
      },
      "category": "help",
      "likes": 15,
      "comments": 8,
      "createdAt": "2025-01-15T10:30:00Z",
      "isLiked": false,
      "isBookmarked": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 342,
    "totalPages": 18
  }
}
```

---

### POST /api/community/posts
Create a new community post.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Need help with DSA assignment",
  "content": "Can someone explain how to implement...",
  "category": "help",
  "tags": ["dsa", "algorithms"],
  "attachments": ["https://..."]
}
```

**Response (201):**
```json
{
  "success": true,
  "post": { /* created post object */ }
}
```

---

### GET /api/community/posts/:id
Get single post with comments.

**Response (200):**
```json
{
  "post": { /* post object */ },
  "comments": [
    {
      "id": "comment_123",
      "content": "You can use...",
      "author": { /* author object */ },
      "likes": 5,
      "replies": [ /* nested replies */ ],
      "createdAt": "2025-01-15T11:00:00Z"
    }
  ]
}
```

---

### POST /api/community/posts/:id/like
Like/unlike a post.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "isLiked": true,
  "likesCount": 16
}
```

---

### POST /api/community/posts/:id/comment
Add comment to a post.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "Great question! Here's how...",
  "parentId": null  // or comment_id for replies
}
```

**Response (201):**
```json
{
  "success": true,
  "comment": { /* created comment object */ }
}
```

---

### POST /api/community/posts/:id/bookmark
Bookmark/unbookmark a post.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "isBookmarked": true
}
```

---

### POST /api/community/posts/:id/report
Report inappropriate content.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "spam",
  "details": "This post contains..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Report submitted successfully"
}
```

---

### POST /api/community/polls
Create a poll post.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Best programming language for beginners?",
  "options": ["Python", "JavaScript", "C++", "Java"],
  "duration": 7  // days
}
```

**Response (201):**
```json
{
  "success": true,
  "poll": { /* created poll object */ }
}
```

---

### POST /api/community/polls/:id/vote
Vote on a poll.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "optionId": "option_123"
}
```

**Response (200):**
```json
{
  "success": true,
  "results": {
    "Python": 45,
    "JavaScript": 32,
    "C++": 15,
    "Java": 8
  }
}
```

---

## Faculty Reviews

### GET /api/faculty
Get list of faculty members.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `department` (optional: filter by department)
- `rating` (optional: minimum rating 1-5)
- `search` (optional: search by name)

**Response (200):**
```json
{
  "faculty": [
    {
      "id": "faculty_123",
      "name": "Dr. Muhammad Ali",
      "department": "CS",
      "designation": "Associate Professor",
      "avatar": "https://...",
      "rating": 4.5,
      "reviewsCount": 28,
      "courses": ["DSA", "Algorithms"]
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### GET /api/faculty/:id
Get faculty member details with reviews.

**Response (200):**
```json
{
  "faculty": {
    "id": "faculty_123",
    "name": "Dr. Muhammad Ali",
    "department": "CS",
    "designation": "Associate Professor",
    "email": "ali@comsats.edu.pk",
    "avatar": "https://...",
    "bio": "...",
    "rating": 4.5,
    "reviewsCount": 28,
    "courses": ["DSA", "Algorithms"]
  },
  "reviews": [
    {
      "id": "review_123",
      "rating": 5,
      "content": "Excellent teacher...",
      "author": { /* anonymous or public */ },
      "createdAt": "2025-01-10T14:30:00Z"
    }
  ]
}
```

---

### POST /api/faculty/:id/review
Submit faculty review.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "content": "Excellent teacher! Very helpful...",
  "anonymous": false
}
```

**Response (201):**
```json
{
  "success": true,
  "review": { /* created review object */ }
}
```

---

## Past Papers

### GET /api/past-papers
Get list of past papers.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `course` (optional: filter by course code)
- `semester` (optional: Fall/Spring)
- `year` (optional: year)
- `type` (optional: midterm/final/quiz)
- `search` (optional: search query)

**Response (200):**
```json
{
  "papers": [
    {
      "id": "paper_123",
      "title": "CS101 Midterm Fall 2024",
      "course": "CS101",
      "courseName": "Programming Fundamentals",
      "semester": "Fall",
      "year": 2024,
      "type": "midterm",
      "fileUrl": "https://...",
      "uploadedBy": { /* user object */ },
      "downloads": 142,
      "createdAt": "2024-11-15T10:00:00Z"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### POST /api/past-papers
Upload a new past paper.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
title: CS101 Midterm Fall 2024
course: CS101
semester: Fall
year: 2024
type: midterm
file: <PDF file>
```

**Response (201):**
```json
{
  "success": true,
  "paper": { /* created paper object */ }
}
```

---

### GET /api/past-papers/:id/download
Download a past paper.

**Response (200):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="CS101_Midterm_Fall_2024.pdf"
<PDF binary data>
```

---

## GPA Calculator

### POST /api/gpa/semester
Calculate semester GPA.

**Request Body:**
```json
{
  "courses": [
    { "name": "DSA", "creditHours": 3, "grade": "A" },
    { "name": "OOP", "creditHours": 3, "grade": "B+" }
  ]
}
```

**Response (200):**
```json
{
  "gpa": 3.67,
  "totalCredits": 6,
  "breakdown": [
    { "course": "DSA", "gradePoints": 4.0, "credits": 3, "earned": 12.0 },
    { "course": "OOP", "gradePoints": 3.33, "credits": 3, "earned": 10.0 }
  ]
}
```

---

### POST /api/gpa/cumulative
Calculate cumulative GPA.

**Request Body:**
```json
{
  "previousGPA": 3.5,
  "previousCredits": 60,
  "currentGPA": 3.8,
  "currentCredits": 15
}
```

**Response (200):**
```json
{
  "cumulativeGPA": 3.56,
  "totalCredits": 75
}
```

---

### POST /api/gpa/aggregate
Calculate aggregate for admissions.

**Request Body:**
```json
{
  "ssc": { "obtained": 900, "total": 1100 },
  "hssc": { "obtained": 950, "total": 1100 },
  "entryTest": 140  // out of 200
}
```

**Response (200):**
```json
{
  "aggregate": 78.5,
  "breakdown": {
    "sscPercentage": 20.45,
    "hsscPercentage": 34.55,
    "entryTestPercentage": 23.50
  }
}
```

---

### POST /api/gpa/save
Save calculation history (requires auth).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "semester",
  "data": { /* calculation data */ },
  "result": { /* calculation result */ }
}
```

**Response (201):**
```json
{
  "success": true,
  "id": "calc_123"
}
```

---

### GET /api/gpa/history
Get saved calculations.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "calculations": [
    {
      "id": "calc_123",
      "type": "semester",
      "result": { "gpa": 3.67 },
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

## News & Events

### GET /api/news
Get latest news articles.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `category` (optional: filter by category)

**Response (200):**
```json
{
  "news": [
    {
      "id": "news_123",
      "title": "COMSATS ranks in top universities",
      "excerpt": "...",
      "content": "...",
      "category": "achievement",
      "image": "https://...",
      "publishedAt": "2025-01-15T08:00:00Z"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### GET /api/events
Get upcoming events.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `upcoming` (default: true)

**Response (200):**
```json
{
  "events": [
    {
      "id": "event_123",
      "title": "Tech Talk: AI in Healthcare",
      "description": "...",
      "location": "Main Auditorium",
      "startDate": "2025-01-20T14:00:00Z",
      "endDate": "2025-01-20T16:00:00Z",
      "organizer": "CS Society",
      "image": "https://..."
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### POST /api/events/:id/register
Register for an event.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Registered successfully"
}
```

---

## Notifications

### GET /api/notifications
Get user notifications.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `unreadOnly` (default: false)
- `page` (default: 1)
- `limit` (default: 20)

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "comment",
      "message": "John Doe commented on your post",
      "link": "/community/posts/post_123",
      "read": false,
      "createdAt": "2025-01-15T12:30:00Z"
    }
  ],
  "unreadCount": 5
}
```

---

### PATCH /api/notifications/:id/read
Mark notification as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true
}
```

---

### POST /api/notifications/mark-all-read
Mark all notifications as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "marked": 12
}
```

---

## Admin

### GET /api/admin/stats
Get platform statistics (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "users": {
    "total": 5420,
    "active": 3210,
    "new": 142
  },
  "posts": {
    "total": 8934,
    "today": 45
  },
  "reports": {
    "pending": 12,
    "resolved": 245
  }
}
```

---

### GET /api/admin/reports
Get reported content (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "reports": [
    {
      "id": "report_123",
      "type": "post",
      "contentId": "post_123",
      "reason": "spam",
      "details": "...",
      "reporter": { /* user object */ },
      "status": "pending",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### POST /api/admin/reports/:id/resolve
Resolve a report (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "action": "remove",  // or "warn", "dismiss"
  "notes": "Content removed for violating..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Report resolved"
}
```

---

## Error Responses

All endpoints may return these standard error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "details": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

---

## Rate Limiting

- **Authenticated requests:** 100 requests per minute
- **Unauthenticated requests:** 20 requests per minute
- **File uploads:** 10 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642267200
```

---

## Pagination

All list endpoints support pagination with these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 342,
    "totalPages": 18,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Authentication

Most endpoints require authentication using Bearer tokens:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tokens are obtained from `/api/auth/login` and expire after 7 days.

---

## Versioning

Current API version: **v1**

Version is included in response headers:
```
X-API-Version: 1.0.0
```

---

## Support

For API support, contact: api-support@comsats.edu.pk

For bug reports, open an issue on GitHub.

---

**Last Updated:** January 2025
