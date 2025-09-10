import type { Metadata } from "next"
import { createMetadata, jsonLdFAQ } from "@/lib/seo"
import { HelpClient } from "./help-client"

// Static FAQ data for both UI and FAQPage JSON-LD
const faqs = [
  { id: "1", question: "How do I find past papers for my course?", answer: "Navigate to the Past Papers section from the main menu. You can filter by department, course code, semester, and instructor. Use the search function to quickly find specific papers. All papers are organized by academic year and semester for easy browsing.", category: "academic", tags: ["past papers", "search", "filter"], helpful: 24 },
  { id: "2", question: "Is the GPA calculator accurate for COMSATS grading?", answer: "Yes, our GPA calculator is specifically designed for COMSATS University grading scale (A+ = 4.0, A = 4.0, A- = 3.67, etc.). Make sure to enter the correct credit hours for each course and select the appropriate grade. The calculator supports both semester and cumulative GPA calculations.", category: "academic", tags: ["gpa", "calculator", "grades", "comsats"], helpful: 31 },
  { id: "3", question: "How does community moderation work?", answer: "Our community is moderated by admin staff and trusted student moderators. All posts are reviewed for appropriate content. You can report inappropriate posts using the report button. We encourage respectful discussion and academic collaboration while maintaining a safe environment for all students.", category: "community", tags: ["moderation", "community", "safety"], helpful: 18 },
  { id: "4", question: "Can I contribute resources or past papers?", answer: "Absolutely! We encourage students to contribute academic resources. You can upload past papers through the admin panel (if you have access) or contact us to submit materials. All contributions are reviewed before being published to ensure quality and relevance.", category: "general", tags: ["contribute", "upload", "resources"], helpful: 15 },
  { id: "5", question: "How do I report bugs or suggest features?", answer: "Use the 'Report an Issue' page accessible from the main menu. You can report bugs, suggest new features, or provide general feedback. We review all submissions and prioritize based on community impact and feasibility.", category: "technical", tags: ["bugs", "feedback", "features"], helpful: 12 },
  { id: "6", question: "What should I do if I can't access my account?", answer: "If you're having trouble logging in, first try resetting your password using the 'Forgot Password' link. If the issue persists, contact our support team with your username and a description of the problem. We'll help you regain access to your account.", category: "technical", tags: ["account", "login", "password"], helpful: 9 },
  { id: "7", question: "How do I join or create study groups?", answer: "Visit the Community section and navigate to the Study Groups tab. You can join existing groups by clicking 'Join Group' or create a new group by providing a name, description, and category. Study groups are great for collaboration and peer learning.", category: "community", tags: ["study groups", "collaboration", "community"], helpful: 22 },
  { id: "8", question: "Are faculty reviews anonymous?", answer: "Yes, all faculty reviews are completely anonymous. Your identity is not revealed to faculty members or other students. However, we do monitor reviews for appropriate content and may remove reviews that violate our community guidelines.", category: "general", tags: ["faculty", "reviews", "anonymous"], helpful: 27 }
]

export const metadata: Metadata = createMetadata({
  title: "Help & Support — CampusAxis",
  description: "CampusAxis help center: answers about past papers, GPA calculator, community features, account support, and more.",
  path: "/help",
  keywords: ["help", "support", "faq", "campusaxis", "past papers help", "gpa calculator help"],
})

export default function HelpPage() {
  const faqJsonLd = jsonLdFAQ(faqs.map(f => ({ question: f.question, answer: f.answer })))
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HelpClient faqs={faqs} />
    </>
  )
}
