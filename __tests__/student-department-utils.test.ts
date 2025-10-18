import { 
  extractDepartmentCodeFromEmail, 
  getDepartmentNameFromCode, 
  getDepartmentFromEmail,
  filterReviewsByDepartment,
  filterFacultyByDepartment,
  filterResourcesByDepartment
} from '../lib/student-department-utils';

describe('Student Department Utilities', () => {
  describe('extractDepartmentCodeFromEmail', () => {
    it('should extract department code from standard student email format', () => {
      expect(extractDepartmentCodeFromEmail('fa22-bse-105@cuilahore.edu.pk')).toBe('CS');
      expect(extractDepartmentCodeFromEmail('sp21-bsse-001@cuilahore.edu.pk')).toBe('SE');
      expect(extractDepartmentCodeFromEmail('fa20-bsee-012@cuilahore.edu.pk')).toBe('EE');
      expect(extractDepartmentCodeFromEmail('fa19-bsmath-045@cuilahore.edu.pk')).toBe('MATH');
    });

    it('should handle alternative email formats', () => {
      expect(extractDepartmentCodeFromEmail('bse-105@cuilahore.edu.pk')).toBe('CS');
      expect(extractDepartmentCodeFromEmail('bscs-001@cuilahore.edu.pk')).toBe('CS');
    });

    it('should return null for invalid emails', () => {
      expect(extractDepartmentCodeFromEmail('')).toBeNull();
      expect(extractDepartmentCodeFromEmail('invalid-email')).toBeNull();
      expect(extractDepartmentCodeFromEmail('user@gmail.com')).toBeNull();
      expect(extractDepartmentCodeFromEmail(null as any)).toBeNull();
      expect(extractDepartmentCodeFromEmail(undefined as any)).toBeNull();
    });
  });

  describe('getDepartmentNameFromCode', () => {
    it('should map department codes to full names', () => {
      expect(getDepartmentNameFromCode('CS')).toBe('Computer Science');
      expect(getDepartmentNameFromCode('SE')).toBe('Software Engineering');
      expect(getDepartmentNameFromCode('EE')).toBe('Electrical Engineering');
      expect(getDepartmentNameFromCode('BBA')).toBe('Business Administration');
    });

    it('should handle case insensitivity', () => {
      expect(getDepartmentNameFromCode('cs')).toBe('Computer Science');
      expect(getDepartmentNameFromCode('Cs')).toBe('Computer Science');
    });

    it('should return null for invalid department codes', () => {
      expect(getDepartmentNameFromCode('')).toBeNull();
      expect(getDepartmentNameFromCode('INVALID')).toBeNull();
      expect(getDepartmentNameFromCode(null as any)).toBeNull();
    });
  });

  describe('getDepartmentFromEmail', () => {
    it('should extract and map department name from email', () => {
      expect(getDepartmentFromEmail('fa22-bse-105@cuilahore.edu.pk')).toBe('Computer Science');
      expect(getDepartmentFromEmail('sp21-bsse-001@cuilahore.edu.pk')).toBe('Software Engineering');
      expect(getDepartmentFromEmail('fa20-bsee-012@cuilahore.edu.pk')).toBe('Electrical Engineering');
    });

    it('should return null for invalid emails', () => {
      expect(getDepartmentFromEmail('')).toBeNull();
      expect(getDepartmentFromEmail('invalid-email')).toBeNull();
      expect(getDepartmentFromEmail('user@gmail.com')).toBeNull();
    });
  });

  describe('filterReviewsByDepartment', () => {
    const mockReviews = [
      { id: 1, faculty: { department: 'Computer Science' }, rating: 4 },
      { id: 2, faculty: { department: 'Electrical Engineering' }, rating: 5 },
      { id: 3, faculty: { department: 'Computer Science' }, rating: 3 },
      { id: 4, faculty: { department: 'Business Administration' }, rating: 4 }
    ];

    it('should filter reviews by department name', () => {
      const filtered = filterReviewsByDepartment(mockReviews, 'Computer Science');
      expect(filtered).toHaveLength(2);
      expect(filtered.every((review: any) => review.faculty.department === 'Computer Science')).toBe(true);
    });

    it('should return all reviews when no department specified', () => {
      const filtered = filterReviewsByDepartment(mockReviews, null);
      expect(filtered).toHaveLength(4);
      expect(filtered).toEqual(mockReviews);
    });
  });

  describe('filterFacultyByDepartment', () => {
    const mockFaculty = [
      { id: 1, name: 'Dr. Smith', department: 'Computer Science' },
      { id: 2, name: 'Dr. Johnson', department: 'Electrical Engineering' },
      { id: 3, name: 'Dr. Williams', department: 'Computer Science' },
      { id: 4, name: 'Dr. Brown', department: 'Business Administration' }
    ];

    it('should filter faculty by department name', () => {
      const filtered = filterFacultyByDepartment(mockFaculty, 'Computer Science');
      expect(filtered).toHaveLength(2);
      expect(filtered.every((member: any) => member.department === 'Computer Science')).toBe(true);
    });

    it('should return all faculty when no department specified', () => {
      const filtered = filterFacultyByDepartment(mockFaculty, null);
      expect(filtered).toHaveLength(4);
      expect(filtered).toEqual(mockFaculty);
    });
  });

  describe('filterResourcesByDepartment', () => {
    const mockResources = [
      { id: 1, title: 'CS Book', department: 'Computer Science' },
      { id: 2, title: 'EE Notes', department: 'Electrical Engineering' },
      { id: 3, title: 'CS Lecture', department: 'Computer Science' },
      { id: 4, title: 'BBA Guide', department: 'Business Administration' }
    ];

    it('should filter resources by department name', () => {
      const filtered = filterResourcesByDepartment(mockResources, 'Computer Science');
      expect(filtered).toHaveLength(2);
      expect(filtered.every((resource: any) => resource.department === 'Computer Science')).toBe(true);
    });

    it('should return all resources when no department specified', () => {
      const filtered = filterResourcesByDepartment(mockResources, null);
      expect(filtered).toHaveLength(4);
      expect(filtered).toEqual(mockResources);
    });
  });
});