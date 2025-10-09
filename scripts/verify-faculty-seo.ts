import { generateFacultyMetadata, generateFacultySchema } from '../lib/faculty-seo';
import type { Faculty } from '../lib/faculty-data';

// Test faculty data
const testFaculty: Faculty = {
  id: "1",
  name: "Dr. Ahmed Khan",
  title: "Professor",
  department: "Computer Science",
  email: "ahmed.khan@cuilahore.edu.pk",
  office: "CS-201",
  phone: "+92-42-111-001-007",
  specialization: ["Software Engineering", "Database Systems", "Web Development"],
  courses: ["CS-101 Programming Fundamentals", "CS-301 Database Systems", "CS-401 Software Engineering"],
  education: ["PhD Computer Science - University of Punjab", "MS Computer Science - LUMS"],
  experience: "15 years",
  averageRating: 4.2,
  totalReviews: 45,
  joinDate: "2010-08-15",
  profileImage: undefined,
};

console.log('Testing generateFacultyMetadata:');
const metadata = generateFacultyMetadata(testFaculty);
console.log('Metadata generated successfully');
console.log('Title:', metadata.title);
console.log('Description length:', metadata.description?.length);

console.log('\nTesting generateFacultySchema:');
const schema = generateFacultySchema(testFaculty);
console.log('Schema generated successfully');
console.log('Type:', schema['@type']);
console.log('Name:', schema.name);
console.log('Department:', schema.department);