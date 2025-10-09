# Faculty Data Seeding

This document explains how to seed faculty data for testing and development purposes.

## Prerequisites

1. Ensure you have the required environment variables set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Make sure your Supabase database is set up with the faculty table.

## Seeding Faculty Data

To seed the faculty data, run:

```bash
npm run db:seed-faculty
```

This will insert sample faculty records into your database for testing purposes.

## Sample Faculty Data

The seed script includes 5 sample faculty members across different departments:
- Computer Science
- Electrical Engineering
- Business Administration

Each faculty member has:
- Name and title
- Department
- Contact information
- Specializations
- Courses taught
- Education background
- Years of experience
- Rating information

## Custom Seeding

For custom faculty data seeding, you can use the admin interface at:
`/admin/faculty/seed`

This allows you to:
- Paste UUIDs to create basic faculty entries
- Paste JSON data for detailed faculty information