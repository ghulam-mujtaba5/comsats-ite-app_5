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
import { ExternalLink } from 'lucide-react'

export default function LMSTroubleshootingPage() {
  const commonIssues = [
    {
      id: 'login',
      title: 'Login Issues',
      description: 'Troubleshooting login problems with the LMS',
      solutions: [
        'Clear your browser cache and cookies',
        'Try logging in with an incognito/private browser window',
        'Ensure you are using the correct username (student ID) and password',
        'Check if your account is activated - contact IT support if unsure',
        'Try using a different browser (Chrome, Firefox, Edge)'
      ]
    },
    {
      id: 'access',
      title: 'Course Access Problems',
      description: 'Unable to see your enrolled courses',
      solutions: [
        'Verify your enrollment status with the registrar',
        'Check if the course has been published by the instructor',
        'Contact your course instructor to ensure you are added to the course',
        'Try refreshing the page or logging out and back in'
      ]
    },
    {
      id: 'submissions',
      title: 'Assignment Submission Issues',
      description: 'Problems uploading or submitting assignments',
      solutions: [
        'Check file size limits (usually 100MB maximum)',
        'Use supported file formats (.doc, .docx, .pdf, .txt, .jpg, .png)',
        'Ensure stable internet connection during upload',
        'Try submitting from a different browser or device',
        'Take a screenshot of any error messages for support'
      ]
    },
    {
      id: 'videos',
      title: 'Video Playback Problems',
      description: 'Issues with watching lecture videos',
      solutions: [
        'Check your internet connection speed (minimum 5 Mbps recommended)',
        'Try a different browser or update your current one',
        'Disable browser extensions that might block content',
        'Clear browser cache and restart browser',
        'Try using the LMS mobile app'
      ]
    }
  ]

  const contactInfo = [
    {
      department: 'IT Help Desk',
      email: 'ithelp@comsats.edu.pk',
      phone: '+92-XXX-XXXXXXX',
      hours: 'Mon-Fri 9:00 AM - 5:00 PM'
    },
    {
      department: 'Academic Support',
      email: 'academicsupport@comsats.edu.pk',
      phone: '+92-XXX-XXXXXXX',
      hours: 'Mon-Fri 10:00 AM - 4:00 PM'
    }
  ]

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">LMS Troubleshooting Guide</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Common issues and solutions for the Learning Management System (LMS)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current LMS operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Operational
              </Badge>
              <span>All systems are functioning normally</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Last checked: {new Date().toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Helpful resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-between" asChild>
              <a href="https://lms.comsats.edu.pk" target="_blank" rel="noopener noreferrer">
                LMS Login Page
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <a href="https://student.comsats.edu.pk" target="_blank" rel="noopener noreferrer">
                Student Portal
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Encountered Issues</CardTitle>
          <CardDescription>
            Common problems and their solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {commonIssues.map((issue) => (
              <AccordionItem value={issue.id} key={issue.id}>
                <AccordionTrigger>
                  <div className="text-left">
                    <h3 className="font-medium">{issue.title}</h3>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 mt-2">
                    {issue.solutions.map((solution, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0"></span>
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Get help from the support teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactInfo.map((contact, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold">{contact.department}</h3>
                <p className="text-sm text-muted-foreground mt-1">{contact.email}</p>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                <p className="text-sm text-muted-foreground">{contact.hours}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}