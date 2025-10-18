'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { Calendar, FileText, Mail, Phone } from 'lucide-react'

export default function ScholarshipsPage() {
  const scholarshipTypes = [
    {
      id: 'merit',
      title: 'Merit-Based Scholarships',
      description: 'Awarded based on academic performance',
      eligibility: [
        'Minimum GPA of 3.0 for undergraduate programs',
        'Minimum GPA of 3.5 for graduate programs',
        'No disciplinary cases',
        'Active participation in extracurricular activities (preferred)'
      ],
      benefits: [
        '50% tuition fee waiver for GPA 3.0-3.49',
        '75% tuition fee waiver for GPA 3.5-3.79',
        '100% tuition fee waiver for GPA 3.8 and above'
      ]
    },
    {
      id: 'need',
      title: 'Need-Based Scholarships',
      description: 'Awarded based on financial need',
      eligibility: [
        'Family income below PKR 100,000 per month',
        'Submission of income certificate from relevant authority',
        'Academic transcripts from previous institutions',
        'Recommendation letters from teachers or community leaders'
      ],
      benefits: [
        'Partial financial assistance based on assessed need',
        'Book allowance of PKR 10,000 per semester',
        'Meal vouchers for campus dining'
      ]
    },
    {
      id: 'sports',
      title: 'Sports Scholarships',
      description: 'Awarded to outstanding athletes',
      eligibility: [
        'Representation at national or provincial level',
        'Certificate from relevant sports federation',
        'Good academic standing (minimum 2.5 GPA)',
        'Medical fitness certificate'
      ],
      benefits: [
        'Full tuition fee waiver',
        'Sports equipment allowance',
        'Specialized coaching and training facilities'
      ]
    }
  ]

  const importantDates = [
    {
      event: 'Fall Semester Applications Open',
      date: 'June 1st'
    },
    {
      event: 'Fall Semester Deadline',
      date: 'June 30th'
    },
    {
      event: 'Spring Semester Applications Open',
      date: 'December 1st'
    },
    {
      event: 'Spring Semester Deadline',
      date: 'December 31st'
    },
    {
      event: 'Selection Interviews',
      date: 'July 15th (Fall), January 15th (Spring)'
    },
    {
      event: 'Announcement of Results',
      date: 'July 30th (Fall), January 30th (Spring)'
    }
  ]

  const contactInfo = [
    {
      department: 'Financial Aid Office',
      email: 'finaid@comsats.edu.pk',
      phone: '+92-XXX-XXXXXXX',
      office: 'Room B-201, Main Building'
    }
  ]

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Scholarships & Financial Aid</h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
          Information about available scholarships and financial assistance programs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Fill out the online application form</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Submit required documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Attend interview (if shortlisted)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Receive notification of results</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Academic transcripts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Income certificate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Recommendation letters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <span>Copy of CNIC/B-Form</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Important Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {importantDates.map((date, index) => (
                <li key={index} className="flex justify-between">
                  <span>{date.event}</span>
                  <span className="font-medium">{date.date}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scholarship Types</CardTitle>
          <CardDescription>
            Different categories of scholarships available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {scholarshipTypes.map((scholarship) => (
              <AccordionItem value={scholarship.id} key={scholarship.id}>
                <AccordionTrigger>
                  <div className="text-left">
                    <h3 className="font-medium">{scholarship.title}</h3>
                    <p className="text-sm text-muted-foreground">{scholarship.description}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                      <ul className="space-y-2">
                        {scholarship.eligibility.map((criteria, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                            <span className="text-sm">{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Benefits</h4>
                      <ul className="space-y-2">
                        {scholarship.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            For inquiries about scholarships and financial aid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactInfo.map((contact, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold">{contact.department}</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{contact.email}</p>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                <p className="text-sm text-muted-foreground">{contact.office}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button asChild>
              <a href="mailto:finaid@comsats.edu.pk">Email Financial Aid Office</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}