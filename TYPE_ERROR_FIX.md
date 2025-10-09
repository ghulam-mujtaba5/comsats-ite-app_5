# Type Error Fix for Post Interface

## Issue
The build was failing with a TypeScript error in [lib/community.ts](file://e:\comsats-ite-app_5\lib\community.ts) at line 126:
```
Type '{ id: string; author: any; avatar: any; department: any; semester: any; time: string; content: any; likes: number; comments: number; shares: number; tags: any; liked: boolean; type: any; }' is missing the following properties from type 'Post': departmentCode, campus, campusCode, batch
```

## Root Cause
The [rowToPost](file://e:\comsats-ite-app_5\lib\community.ts#L124-L140) function in [lib/community.ts](file://e:\comsats-ite-app_5\lib\community.ts) was not providing all the required properties defined in the Post interface from [lib/community-data.ts](file://e:\comsats-ite-app_5\lib\community-data.ts).

The Post interface requires:
- id: string
- author: string
- avatar: string
- department: string
- departmentCode: string
- campus: string
- campusCode: string
- semester: string
- batch: string
- time: string
- content: string
- likes: number
- comments: number
- shares: number
- tags: string[]
- liked: boolean
- type: string

But the [rowToPost](file://e:\comsats-ite-app_5\lib\community.ts#L124-L140) function was only providing:
- id: string
- author: any
- avatar: any
- department: any
- semester: any
- time: string
- content: any
- likes: number
- comments: number
- shares: number
- tags: any
- liked: boolean
- type: any

Missing properties:
- departmentCode: string
- campus: string
- campusCode: string
- batch: string

## Fix
Updated the [rowToPost](file://e:\comsats-ite-app_5\lib\community.ts#L124-L140) function in [lib/community.ts](file://e:\comsats-ite-app_5\lib\community.ts) to include all required properties with appropriate default values:

```typescript
function rowToPost(row: any): Post {
  return {
    id: String(row.id),
    author: row.author_name || row.user_name || "Anonymous",
    avatar: row.avatar_url || "/student-avatar.png",
    department: row.department || "",
    departmentCode: row.department_code || "",
    campus: row.campus || "",
    campusCode: row.campus_code || "",
    semester: row.semester || "",
    batch: row.batch || "",
    time: row.created_at ? new Date(row.created_at).toLocaleString() : "",
    content: row.content || "",
    likes: Number(row.likes ?? 0),
    comments: Number(row.comments_count ?? 0),
    shares: Number(row.shares ?? 0),
    tags: Array.isArray(row.tags) ? row.tags : [],
    liked: !!row.liked,
    type: row.type || "general",
  }
}
```

## Verification
After applying the fix, the build completed successfully:
```
$ pnpm run build
> my-v0-project@0.1.0 build E:\comsats-ite-app_5
> next build

▲ Next.js 15.2.4
- Environments: .env.local

Creating an optimized production build ...
✓ Finalizing page optimization

[Build completed successfully with no errors]
```

## Impact
This fix ensures that:
1. All Post objects created by the [rowToPost](file://e:\comsats-ite-app_5\lib\community.ts#L124-L140) function conform to the Post interface
2. The application builds successfully without TypeScript errors
3. Default values are provided for all required properties to prevent runtime errors
4. The community features continue to work as expected with proper typing

The fix is backward compatible and doesn't change any existing functionality.