import { EMAIL_PREFIX_TO_DEPARTMENT_CODE } from '@lib/campus-email-mapping';

// Department code to full name mapping
export const DEPARTMENT_CODE_TO_NAME: Record<string, string> = {
  'CS': 'Computer Science',
  'SE': 'Software Engineering',
  'EE': 'Electrical Engineering',
  'ELE': 'Electronics Engineering',
  'TE': 'Telecom Engineering',
  'BBA': 'Business Administration',
  'MATH': 'Mathematics',
  'PHY': 'Physics',
  'CHEM': 'Chemistry',
  'CPE': 'Computer Engineering',
  'ME': 'Mechanical Engineering',
  'CE': 'Civil Engineering',
  'BT': 'Biotechnology',
  'ENV': 'Environmental Sciences',
  'ARCH': 'Architecture',
  'ECON': 'Economics',
  'PHARM': 'Pharmacy',
  'MGT': 'Management Sciences',
  'HUM': 'Humanities'
};

/**
 * Parse student email to extract department code
 * Example: fa22-bse-105@cuilahore.edu.pk -> CS
 * @param email Student email address
 * @returns Department code or null if not found
 */
export function extractDepartmentCodeFromEmail(email: string): string | null {
  if (!email || typeof email !== 'string') {
    return null;
  }

  // Extract the prefix part before @
  const emailPrefix = email.split('@')[0];
  if (!emailPrefix) {
    return null;
  }

  // Split by hyphens to get components
  const parts = emailPrefix.split('-');
  if (parts.length < 2) {
    return null;
  }

  // The department code is typically the second or third part
  // e.g., fa22-bse-105 -> bse (second part)
  // e.g., bse-105 -> bse (first part)
  let departmentPrefix = '';
  
  // Try second part first (most common format)
  if (parts.length >= 2) {
    departmentPrefix = parts[1].toLowerCase();
  }
  
  // If second part is not a valid department prefix, try first part
  if (!EMAIL_PREFIX_TO_DEPARTMENT_CODE[departmentPrefix]) {
    departmentPrefix = parts[0].toLowerCase();
  }

  // If still not valid, try third part (for formats like fa22-bse-105)
  if (!EMAIL_PREFIX_TO_DEPARTMENT_CODE[departmentPrefix] && parts.length >= 3) {
    departmentPrefix = parts[2].toLowerCase();
  }

  // Map to department code
  return EMAIL_PREFIX_TO_DEPARTMENT_CODE[departmentPrefix] || null;
}

/**
 * Get department name from department code
 * @param departmentCode Department code (e.g., 'CS', 'EE')
 * @returns Full department name or null if not found
 */
export function getDepartmentNameFromCode(departmentCode: string): string | null {
  if (!departmentCode || typeof departmentCode !== 'string') {
    return null;
  }
  
  return DEPARTMENT_CODE_TO_NAME[departmentCode.toUpperCase()] || null;
}

/**
 * Parse student email and get department name
 * @param email Student email address
 * @returns Department name or null if not found
 */
export function getDepartmentFromEmail(email: string): string | null {
  const departmentCode = extractDepartmentCodeFromEmail(email);
  if (!departmentCode) {
    return null;
  }
  
  return getDepartmentNameFromCode(departmentCode);
}

/**
 * Filter faculty reviews by department
 * @param reviews Array of faculty reviews
 * @param departmentName Department name to filter by
 * @returns Filtered array of reviews
 */
export function filterReviewsByDepartment(reviews: any[], departmentName: string | null): any[] {
  if (!departmentName || !reviews || reviews.length === 0) {
    return reviews || [];
  }

  return reviews.filter(review => {
    // Check if the faculty member belongs to the specified department
    return review.faculty?.department?.toLowerCase() === departmentName.toLowerCase();
  });
}

/**
 * Filter faculty by department
 * @param faculty Array of faculty members
 * @param departmentName Department name to filter by
 * @returns Filtered array of faculty members
 */
export function filterFacultyByDepartment(faculty: any[], departmentName: string | null): any[] {
  if (!departmentName || !faculty || faculty.length === 0) {
    return faculty || [];
  }

  return faculty.filter(member => {
    return member.department?.toLowerCase() === departmentName.toLowerCase();
  });
}

/**
 * Filter resources by department
 * @param resources Array of resources
 * @param departmentName Department name to filter by
 * @returns Filtered array of resources
 */
export function filterResourcesByDepartment(resources: any[], departmentName: string | null): any[] {
  if (!departmentName || !resources || resources.length === 0) {
    return resources || [];
  }

  return resources.filter(resource => {
    return resource.department?.toLowerCase() === departmentName.toLowerCase();
  });
}

// Export the mapping for use in other components
export { EMAIL_PREFIX_TO_DEPARTMENT_CODE };