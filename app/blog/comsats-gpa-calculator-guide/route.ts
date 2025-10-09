import { NextResponse } from 'next/server'

// This is a static route to ensure the blog post is properly indexed
export async function GET() {
  return NextResponse.json({
    slug: 'comsats-gpa-calculator-guide',
    title: 'Complete Guide to COMSATS GPA Calculator - How to Calculate Your GPA',
    excerpt: 'Learn how to calculate your GPA at COMSATS University with our free GPA calculator. Complete guide to semester GPA, cumulative CGPA, and admission aggregate calculations.',
    category: 'academic',
    tags: ['gpa', 'calculator', 'comsats', 'academic', 'guide'],
    author_name: 'CampusAxis',
    published_at: '2024-01-15T00:00:00Z',
    is_featured: true,
    view_count: 0
  })
}