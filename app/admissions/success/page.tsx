"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { BrandedBanner } from "@/components/layout/branded-banner"

export default function AdmissionsSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <BrandedBanner 
        title="Admission Application Submitted"
        description="Your application has been successfully received"
        variant="gradient"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <Card className="glass-card w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              </div>
              <CardTitle className="text-2xl font-bold">Application Submitted!</CardTitle>
              <CardDescription>
                Your admission application has been successfully received
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                Thank you for applying to COMSATS University. We have received your application 
                and our admissions team will review it shortly.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Next Steps</h3>
                <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 text-left space-y-1">
                  <li>• You will receive a confirmation email shortly</li>
                  <li>• Our team will review your application within 3-5 business days</li>
                  <li>• Shortlisted candidates will be contacted for further process</li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full glass-button-primary">
                  <Link href="/admissions">Submit Another Application</Link>
                </Button>
                <Button variant="outline" asChild className="w-full glass-button-secondary">
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}