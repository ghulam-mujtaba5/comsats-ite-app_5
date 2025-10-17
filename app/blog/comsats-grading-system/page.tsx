import React from "react"
import { CumulativeGPACalculator } from "@/components/gpa/cumulative-gpa-calculator"
import { GPAPlanningCalculator } from "@/components/gpa/gpa-planning-calculator"
import { jsonLdBlogPosting, jsonLdBreadcrumb } from "@/lib/seo"
import layout from "@/app/styles/common.module.css"
import "../blog.light.module.css"
import "../blog.dark.module.css"

export const metadata = {
  title: "COMSATS Grading System & GPA Calculators",
  description:
    "Understand COMSATS' absolute grading system, grading scale, GPA/CGPA formulas, and use interactive calculators to compute and plan your GPA.",
}

export default function Page() {
  const jsonLd = jsonLdBlogPosting({
    title: metadata.title,
    description: metadata.description,
    slug: 'comsats-grading-system',
    authorName: 'CampusAxis',
    datePublished: '2024-01-01',
  })
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'COMSATS Grading System', path: '/blog/comsats-grading-system' },
  ])
  return (
    <div className={`${layout.section} ${layout.max4xl} px-4 py-8 space-y-10`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumb]) }} />
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>COMSATS Grading System</h1>
        <p>
          Understanding the grading system of your university is crucial for tracking your academic progress and
          planning your studies effectively. For students at the COMSATS Institute of Information Technology, the GPA
          system is a key component in measuring academic performance. This blog provides a detailed explanation of the
          COMSATS GPA system, including the calculation methods and the grading scale.
        </p>

        <h2>Absolute Grading System</h2>
        <p>
          COMSATS employs an absolute grading system to assess student performance. Unlike relative grading systems,
          where grades are assigned based on a comparison with peers, the absolute grading system awards grades based on
          predetermined thresholds. This ensures that students are evaluated strictly on their individual performance.
        </p>

        <h2>Breakdown of Marks</h2>
        <ul>
          <li>
            <strong>Midterm Exams (25%)</strong>: Midterm exams are held midway through the semester and contribute 25%
            to the final grade.
          </li>
          <li>
            <strong>Quizzes and Assignments (25%)</strong>: Regular quizzes and assignments throughout the semester make
            up another 25% of the final grade.
          </li>
          <li>
            <strong>Final Exams (50%)</strong>: The final exams, held at the end of the semester, have the most
            significant weight, contributing 50% to the final grade.
          </li>
        </ul>
        <p>
          This distribution ensures a balanced evaluation, considering both continuous assessment and performance in
          comprehensive exams.
        </p>

        <h2>Grading Scale</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Grade</th>
                <th>Marks (%)</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>A</td><td>85 and above</td><td>4.00</td></tr>
              <tr><td>A-</td><td>80–84</td><td>3.66</td></tr>
              <tr><td>B+</td><td>75–79</td><td>3.33</td></tr>
              <tr><td>B</td><td>71–74</td><td>3.00</td></tr>
              <tr><td>B-</td><td>68–70</td><td>2.66</td></tr>
              <tr><td>C+</td><td>64–67</td><td>2.33</td></tr>
              <tr><td>C</td><td>61–63</td><td>2.00</td></tr>
              <tr><td>C-</td><td>58–60</td><td>1.66</td></tr>
              <tr><td>D+</td><td>54–57</td><td>1.33</td></tr>
              <tr><td>D</td><td>50–53</td><td>1.00</td></tr>
              <tr><td>F</td><td>0–49</td><td>0.00 (Fail)</td></tr>
            </tbody>
          </table>
        </div>

        <h2>GPA and CGPA Calculation</h2>
        <p>
          The Grade Point Average (GPA) for a semester is calculated using the following general formula:
        </p>
        <pre>
          <code>GPA = (Σ (Grade Points × Credit Hours)) / (Σ Credit Hours)</code>
        </pre>
        <p>
          The Cumulative Grade Point Average (CGPA) is the weighted average of the GPA scores of all semesters
          completed so far:
        </p>
        <pre>
          <code>CGPA = (Σ (GPA of each semester × Credit Hours of each semester)) / (Σ Credit Hours of all semesters)</code>
        </pre>
        <p>
          Both GPA and CGPA provide a comprehensive overview of a student’s academic performance, with the CGPA
          reflecting the overall performance across multiple semesters.
        </p>

        <h2>Conclusion</h2>
        <p>
          Understanding the GPA system at COMSATS is essential for academic planning and performance tracking. The
          absolute grading system, combined with a clear breakdown of assessment components, ensures that students can
          focus on both continuous learning and final examinations. By maintaining a consistent performance across all
          components, students can achieve their desired GPA and CGPA, paving the way for academic success and future
          opportunities.
        </p>
      </article>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">GPA Calculator</h2>
        <CumulativeGPACalculator />
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">GPA Planning Calculator</h2>
        <GPAPlanningCalculator />
      </section>
    </div>
  )
}
