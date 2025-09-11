import { createMetadata, jsonLdBreadcrumb, jsonLdFAQ, jsonLdCollectionPage, jsonLdSpeakable } from '@/lib/seo'
import StudentSupportClient from './student-support-client'
import type { Metadata } from 'next'

export const metadata: Metadata = createMetadata({
  title: 'Student Support & Counseling – COMSATS Assistance',
  description: 'Find COMSATS student support resources: counseling, crisis helplines, academic tutoring, financial aid, career guidance and wellness services.',
  path: '/student-support',
  keywords: ['COMSATS student support','COMSATS counseling','academic tutoring COMSATS','financial aid COMSATS','career guidance COMSATS','mental health support COMSATS']
})

export default function StudentSupportPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Student Support', path: '/student-support' },
  ])
  const faq = jsonLdFAQ([
    { question: 'How do I get academic tutoring at COMSATS?', answer: 'Use the Academic Tutoring resource listed to email or visit the tutoring office during available hours.' },
    { question: 'Is there 24/7 crisis support for students?', answer: 'Yes, the Crisis Helpline is available 24/7 for emergency mental health support.' },
    { question: 'Can I request support anonymously?', answer: 'Yes, you can submit a support request anonymously using the request support form.' },
  ])
  const collection = jsonLdCollectionPage({
    name: 'Student Support Resources',
    description: 'Central directory of COMSATS University student wellbeing and academic support services.',
    path: '/student-support',
    items: [
      { name: 'Counseling Services', url: '/student-support#counseling' },
      { name: 'Crisis Helpline', url: '/student-support#crisis' },
      { name: 'Academic Tutoring', url: '/student-support#tutoring' },
      { name: 'Financial Aid Office', url: '/student-support#financial-aid' },
      { name: 'Career Counseling', url: '/student-support#career' },
    ]
  })
  const speakable = jsonLdSpeakable(['h1','p'])
  const jsonArray = [breadcrumb, faq, collection, speakable]
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonArray) }} />
      <StudentSupportClient />
    </>
  )
}
