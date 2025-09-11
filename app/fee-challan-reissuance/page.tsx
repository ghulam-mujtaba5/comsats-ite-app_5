import React from 'react'
import { jsonLdBreadcrumb, jsonLdFAQ } from '@/lib/seo'

export const metadata = {
  title: 'COMSATS Fee Challan Guide (Download, Reissue, Payment Options)',
  description: 'Step-by-step COMSATS fee challan guide: how to download, reissue a lost challan, payment methods (banks & online), late fee policy, and campus-specific notes.',
  alternates: { canonical: (process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site') + '/fee-challan-reissuance' },
  keywords: [
    'COMSATS fee challan', 'COMSATS fee reissue', 'COMSATS late fee', 'COMSATS bank payment', 'COMSATS challan download'
  ],
  openGraph: {
    title: 'COMSATS Fee Challan Guide (Download, Reissue, Payment Options)',
    description: 'Download or reissue COMSATS fee challan, learn bank options, online payments, late fee policy & deadlines.',
    url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site') + '/fee-challan-reissuance'
  },
  twitter: {
    title: 'COMSATS Fee Challan Guide – Download & Reissue',
    description: 'How to download, reissue and pay your COMSATS fee challan. Late fee & campus notes included.'
  }
}

export default function FeeChallanGuidePage() {
  const faqs = [
    { question: 'How do I download my COMSATS fee challan?', answer: 'Log into the official student portal (CUOnline), navigate to the Finance/Student Accounts section and click download/print for the current semester challan.' },
    { question: 'What if I lost my fee challan?', answer: 'Use the reissue option in the portal if available or visit Student Accounts. Some campuses allow regenerating the challan online within the due period.' },
    { question: 'Which banks accept COMSATS challans?', answer: 'Typically UBL, HBL and sometimes other partner banks. The bank list is printed on the challan—confirm campus-specific limitations.' },
    { question: 'Can I pay COMSATS fee online?', answer: 'Some campuses support online banking via account number/reference on the challan. Always verify the beneficiary details before sending funds.' },
    { question: 'What happens after the due date?', answer: 'A late fee surcharge is applied. After the grace period, your portal access may be restricted until cleared.' },
  ]

  const faqJson = jsonLdFAQ(faqs)
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Fee Challan Guide', path: '/fee-challan-reissuance' },
  ])

  return (
    <div className='container mx-auto max-w-4xl px-4 py-10 space-y-10'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify([faqJson, breadcrumb]) }} />
      <article className='prose prose-neutral dark:prose-invert max-w-none'>
        <h1>COMSATS Fee Challan Guide</h1>
        <p>This guide helps you download, reissue and pay your COMSATS fee challan correctly. It also explains deadlines, late fee policy, and campus-specific considerations so you avoid penalties or portal restrictions.</p>

        <h2>1. Downloading Your Fee Challan</h2>
        <ol>
          <li>Log into the official CUOnline / student portal.</li>
          <li>Open the Finance / Accounts or Student Accounts section.</li>
          <li>Select the current semester invoice/challan.</li>
          <li>Click Download or Print (save as PDF for records).</li>
        </ol>
        <p><strong>Tip:</strong> Always check the amount, semester label, and due date before paying.</p>

        <h2>2. Reissuing a Lost or Expired Challan</h2>
        <p>If you lost the PDF or printed slip you can usually regenerate it before the due date. After expiry a fresh challan with late fee may be required.</p>
        <ul>
          <li>Portal “Reissue” button (if enabled by campus).</li>
          <li>Visit Student Accounts physically with Student ID.</li>
          <li>Request an updated challan if late fee has applied.</li>
        </ul>

        <h2>3. Payment Methods</h2>
        <p>Common payment channels (campus differences may apply):</p>
        <ul>
          <li>Bank branches listed on the challan (often UBL / HBL).</li>
          <li>Online banking using the reference or account number.</li>
          <li>Deposit machines (if bank supports manual voucher input).</li>
        </ul>
        <p><strong>Keep the stamped bank copy.</strong> It may be needed for dispute resolution.</p>

        <h2>4. Late Fee & Grace Policy</h2>
        <p>After the due date, a late surcharge is added. Repeated delays can trigger registration holds. Always pay before examination clearance deadlines (midterm/final).</p>

        <h2>5. Verifying Payment</h2>
        <p>Payments may take 12–48 hours to reflect. If not updated:</p>
        <ul>
          <li>Confirm bank posted it to the correct reference.</li>
          <li>Open a ticket with Accounts or use the campus help desk.</li>
          <li>Keep digital proof (scan/photo of receipt).</li>
        </ul>

        <h2>6. Common Issues & Fixes</h2>
        <ul>
          <li><strong>Portal not showing challan:</strong> Clear cache or try desktop browser; campus may still be finalizing invoices.</li>
          <li><strong>Amount mismatch:</strong> Recheck registered credit hours and lab/course fees.</li>
          <li><strong>Payment not updating:</strong> Wait one banking day then contact Accounts with receipt scan.</li>
        </ul>

        <h2>FAQs</h2>
        <dl>
          {faqs.map(f => (
            <div key={f.question}>
              <dt><strong>{f.question}</strong></dt>
              <dd>{f.answer}</dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  )
}
