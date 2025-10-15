# Student Department Filtering Implementation

## Overview
This implementation parses student email addresses to extract department codes, maps these codes to department names, and uses this information to automatically filter content like faculty reviews, faculty listings, and resources by department. This provides a personalized experience for students based on their academic department.

## Key Features
1. **Email Parsing**: Extracts department information from student email addresses
2. **Department Mapping**: Maps department codes to full department names
3. **Automatic Filtering**: Automatically filters content based on the user's department
4. **User Override**: Allows users to view content from all departments

## Implementation Details

### 1. Utility Functions (`lib/student-department-utils.ts`)

The core functionality is implemented in `lib/student-department-utils.ts` with the following functions:

- `extractDepartmentCodeFromEmail(email: string)`: Parses student email to extract department code
- `getDepartmentNameFromCode(departmentCode: string)`: Maps department code to full department name
- `getDepartmentFromEmail(email: string)`: Combines the above to get department name directly from email
- `filterReviewsByDepartment(reviews: any[], departmentName: string | null)`: Filters faculty reviews by department
- `filterFacultyByDepartment(faculty: any[], departmentName: string | null)`: Filters faculty by department
- `filterResourcesByDepartment(resources: any[], departmentName: string | null)`: Filters resources by department

### 2. Email Format Support

The system supports various COMSATS student email formats:
- `fa22-bse-105@cuilahore.edu.pk` → Computer Science (CS)
- `sp21-bsse-001@cuilahore.edu.pk` → Software Engineering (SE)
- `fa20-bsee-012@cuilahore.edu.pk` → Electrical Engineering (EE)
- `bse-105@cuilahore.edu.pk` → Computer Science (CS)
- `bscs-001@cuilahore.edu.pk` → Computer Science (CS)

### 3. Department Code Mapping

The system maps common department prefixes to their codes:
- `bse`, `bscs`, `mscs`, `phdcs` → `CS` (Computer Science)
- `bsse` → `SE` (Software Engineering)
- `bsee`, `msee` → `EE` (Electrical Engineering)
- `bsele` → `ELE` (Electronics Engineering)
- `bste` → `TE` (Telecom Engineering)
- `bba`, `mba` → `BBA` (Business Administration)
- And many more...

### 4. Department Name Mapping

Department codes are mapped to full department names:
- `CS` → Computer Science
- `SE` → Software Engineering
- `EE` → Electrical Engineering
- `BBA` → Business Administration
- And others...

## Integration Points

### 1. Admin Reviews Page (`app/admin/reviews/page.tsx`)

- Automatically filters reviews to show only those from the admin user's department
- Shows a notification indicating automatic filtering
- Allows admins to override the filter to view all departments

### 2. Faculty Page (`app/faculty/page.tsx`)

- Automatically filters faculty to show only those from the student user's department
- Shows a notification indicating automatic filtering
- Allows students to override the filter to view all departments

### 3. Resources Page (`app/resources/page.tsx`)

- Automatically filters resources to show only those from the student user's department
- Shows a notification indicating automatic filtering
- Allows students to override the filter to view all departments

## User Experience

1. When a student or admin logs in, their department is automatically detected from their email
2. Content is automatically filtered to show only items relevant to their department
3. A notification is displayed indicating that content has been auto-filtered
4. Users can easily override the filter by selecting "All Departments" to view content from all departments

## Testing

Unit tests have been created in `__tests__/student-department-utils.test.ts` to verify:
- Email parsing functionality
- Department code to name mapping
- Content filtering functions
- Edge cases and error handling

## Benefits

1. **Personalized Experience**: Students see content relevant to their department by default
2. **Reduced Information Overload**: Filters out irrelevant content automatically
3. **Easy Navigation**: Users can still access all content when needed
4. **Automatic Detection**: No manual setup required from users
5. **Scalable**: Works across all COMSATS campuses and departments

## Future Enhancements

1. **Campus-Specific Filtering**: Extend filtering to include campus information
2. **Program-Level Filtering**: Add filtering based on specific degree programs
3. **Advanced Preferences**: Allow users to set filtering preferences
4. **Analytics**: Track usage patterns of department filtering