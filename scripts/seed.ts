/* eslint-disable no-console */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Supabase URL or Service Role Key is missing from environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const facultyData = [
  {
    id: "1",
    name: "Dr. Muhammad Usman",
    title: "Associate Professor",
    department: "Computer Science",
    email: "usman@cuilahore.edu.pk",
    office: "A-201, CS Block",
    profile_image: "/male-student-avatar.png",
    specialization: ["Artificial Intelligence", "Machine Learning"],
    courses: ["CS101 - Intro to CS", "AI401 - Advanced AI"],
    education: ["PhD in Computer Science, FAST-NUCES"],
  },
  {
    id: "2",
    name: "Dr. Sobia Irum",
    title: "Assistant Professor",
    department: "Software Engineering",
    email: "sobia.irum@cuilahore.edu.pk",
    office: "B-105, SE Block",
    profile_image: "/female-student-avatar.png",
    specialization: ["Software Quality Assurance", "Web Engineering"],
    courses: ["SE201 - Software Design", "SE321 - Web Development"],
    education: ["PhD in Software Engineering, COMSATS"],
  },
];

const reviewData = [
  {
    faculty_id: "1",
    student_name: "Ahmad Ali",
    course: "CS101",
    semester: "Fall 2023",
    rating: 5,
    comment: "Dr. Usman is an excellent teacher. His concepts are very clear.",
    is_anonymous: false,
  },
  {
    faculty_id: "2",
    student_name: "Fatima Khan",
    course: "SE321",
    semester: "Spring 2024",
    rating: 4,
    comment: "Dr. Sobia explains web technologies very well. Highly recommended.",
    is_anonymous: false,
  },
];

const pastPapersData = [
  {
    course_code: "CS101",
    course_name: "Introduction to Computer Science",
    file_url: "/placeholder-7ca42.png",
    semester: "Fall 2023",
    year: 2023,
    type: "Mid Term",
  },
  {
    course_code: "SE321",
    course_name: "Web Development",
    file_url: "/placeholder-7ca42.png",
    semester: "Spring 2024",
    year: 2024,
    type: "Final Term",
  },
];

async function seedDatabase() {
  console.log("Seeding database...");

  // Seed faculty
  const { error: facultyError } = await supabase.from("faculty").upsert(facultyData);
  if (facultyError) {
    console.error("Error seeding faculty:", facultyError.message);
  } else {
    console.log("Faculty seeded successfully.");
  }

  // Seed reviews
  const { error: reviewError } = await supabase.from("reviews").upsert(reviewData);
  if (reviewError) {
    console.error("Error seeding reviews:", reviewError.message);
  } else {
    console.log("Reviews seeded successfully.");
  }

  // Seed past papers
  const { error: pastPapersError } = await supabase.from("past_papers").upsert(pastPapersData);
  if (pastPapersError) {
    console.error("Error seeding past papers:", pastPapersError.message);
  } else {
    console.log("Past papers seeded successfully.");
  }

  console.log("Database seeding complete.");
}

seedDatabase();
