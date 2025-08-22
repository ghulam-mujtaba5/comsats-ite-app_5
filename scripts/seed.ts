/* eslint-disable no-console */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

console.log("Starting seed script...");

config({ path: ".env.local" });
console.log("Loaded .env.local file.");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(`Supabase URL loaded: ${!!supabaseUrl}`);
console.log(`Supabase Service Role Key loaded: ${!!supabaseServiceRoleKey}`);

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase URL or Service Role Key is missing from environment variables.");
  process.exit(1);
}

console.log("Creating Supabase client...");
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
console.log("Supabase client created successfully.");

const facultyData = [
  {
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
  try {
    console.log("Seeding database...");

    // Seed faculty
    const { data: seededFaculty, error: facultyError } = await supabase
      .from("faculty")
      .insert(facultyData)
      .select();
    if (facultyError) throw facultyError;
    console.log(`Faculty seeded successfully: ${seededFaculty.length} records`);

    // Create test users for reviews
    const testUsers = [
      { email: "testuser1@example.com", password: "password123" },
      { email: "testuser2@example.com", password: "password123" },
    ];
    const seededUserIds = [];

    for (const user of testUsers) {
      // Check if user exists
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error('Error listing users:', listError.message);
        continue;
      }
      const existingUser = users.find(u => u.email === user.email);

      if (existingUser) {
        seededUserIds.push(existingUser.id);
      } else {
        const { data, error } = await supabase.auth.admin.createUser(user);
        if (error) {
          console.error(`Error creating user ${user.email}:`, error.message);
        } else if (data.user) {
          seededUserIds.push(data.user.id);
        }
      }
    }

    if (seededUserIds.length < 2) {
      console.error("Could not create or find test users for reviews. Skipping review seeding.");
    } else if (seededFaculty && seededFaculty.length >= 2) {
      const reviewData = [
        {
          faculty_id: seededFaculty[0].id,
          user_id: seededUserIds[0],
          student_name: "Ahmad Ali",
          course: "CS101",
          semester: "Fall 2023",
          rating: 5,
          teaching_quality: 5,
          accessibility: 4,
          course_material: 5,
          grading: 4,
          comment: "Dr. Usman is an excellent teacher. His concepts are very clear.",
          pros: ["Clear explanations", "Practical examples"],
          cons: ["Strict grading"],
          would_recommend: true,
          is_anonymous: false,
          helpful: 10,
          reported: 0,
        },
        {
          faculty_id: seededFaculty[1].id,
          user_id: seededUserIds[1],
          student_name: "Fatima Khan",
          course: "SE321",
          semester: "Spring 2024",
          rating: 4,
          teaching_quality: 4,
          accessibility: 5,
          course_material: 4,
          grading: 4,
          comment: "Dr. Sobia explains web technologies very well. Highly recommended.",
          pros: ["Engaging teaching", "Fair grading"],
          cons: ["Pacing can be fast"],
          would_recommend: true,
          is_anonymous: false,
          helpful: 8,
          reported: 0,
        },
      ];
      const { error: reviewError } = await supabase.from("reviews").insert(reviewData);
      if (reviewError) throw reviewError;
      console.log("Reviews seeded successfully.");
    }

    // Seed past papers (commented out as table does not exist yet)
    /*
    const { error: pastPapersError } = await supabase.from("past_papers").insert(pastPapersData);
    if (pastPapersError) throw pastPapersError;
    console.log("Past papers seeded successfully.");
    */

    // Seed community posts
    const communityPosts = [
      {
        content:
          "Just finished my final year project on AI-based student performance prediction. Model hit 94% accuracy using ensemble methods.",
        type: "achievement",
        tags: ["AI", "Final Year Project", "Machine Learning"],
        user_id: seededUserIds[0],
      },
      {
        content:
          "Looking for study partners for Power Systems. Planning to meet Tue/Thu 4 PM in the library. Anyone interested?",
        type: "study",
        tags: ["Study Group", "Power Systems", "Electrical Engineering"],
        user_id: seededUserIds[1],
      },
    ];

    const { data: insertedPosts, error: postsErr } = await supabase
      .from("community_posts")
      .insert(communityPosts)
      .select("id, author, created_at");
    if (postsErr) throw postsErr;
    console.log(`Inserted ${insertedPosts?.length ?? 0} community posts.`);

    // Map replies to posts
    const firstPostId = insertedPosts?.[0]?.id;
    const secondPostId = insertedPosts?.[1]?.id;

    if (firstPostId) {
      const replies = [
        {
          post_id: firstPostId,
          content:
            "This is super helpful! I was looking for a good starting point for my FYP. Can you share the dataset?",
          author_name: "zainab",
          avatar_url: "/female-student-avatar.png",
          likes: 5,
        },
        {
          post_id: firstPostId,
          content: "Sure! I've uploaded the dataset to a public repo. Here is the link: https://example.com/repo",
          author_name: "ahmad",
          avatar_url: "/student-avatar.png",
          likes: 8,
        },
      ];
      const { error: repliesErr } = await supabase.from("community_replies").insert(replies);
      if (repliesErr) throw repliesErr;
      console.log("Inserted replies for the first community post.");
    }

    if (secondPostId) {
      const replies = [
        {
          post_id: secondPostId,
          content: "I'm in! I'm struggling with transmission lines; a study group would be great.",
          author_name: "usman",
          avatar_url: "/male-student-avatar.png",
          likes: 3,
        },
      ];
      const { error: repliesErr2 } = await supabase.from("community_replies").insert(replies);
      if (repliesErr2) throw repliesErr2;
      console.log("Inserted replies for the second community post.");
    }

    console.log("Database seeding complete.");
  } catch (error: any) {
    console.error("An error occurred during database seeding:", error.message);
    process.exit(1);
  }
}

seedDatabase();
