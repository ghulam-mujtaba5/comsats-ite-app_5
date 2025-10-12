"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  FileText, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  HelpCircle,
  ArrowRight,
  ExternalLink
} from "lucide-react"
import { BrandedBanner } from "@/components/layout/branded-banner"

export default function AdmissionsDocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <BrandedBanner 
        title="Admissions System Documentation"
        description="Complete guide to the COMSATS admission management system"
        variant="gradient"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Overview
              </CardTitle>
              <CardDescription>
                Understanding the admissions management workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The admissions system allows students to apply online for admission to COMSATS University. 
                Administrators can review applications, update statuses, and manage the entire admission process 
                through the admin panel.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="glass-card p-4 rounded-lg">
                  <Users className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-semibold">Student Portal</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Students apply through the public admissions form
                  </p>
                </div>
                
                <div className="glass-card p-4 rounded-lg">
                  <Calendar className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="font-semibold">Application Review</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Admins review and manage applications
                  </p>
                </div>
                
                <div className="glass-card p-4 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-semibold">Status Management</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track applications through the admission pipeline
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Student Application Process */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Student Application Process
              </CardTitle>
              <CardDescription>
                How students apply for admission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Access Application Form</h4>
                    <p className="text-sm text-muted-foreground">
                      Students navigate to the admissions page from the main navigation
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Fill Application Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Students provide personal information, academic marks, and program preferences
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Automatic Aggregate Calculation</h4>
                    <p className="text-sm text-muted-foreground">
                      System calculates admission aggregate using COMSATS formula (10% Matric + 40% Inter + 50% Entry Test)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">4</div>
                  <div>
                    <h4 className="font-medium">Submit Application</h4>
                    <p className="text-sm text-muted-foreground">
                      Students review and submit their application for review
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">5</div>
                  <div>
                    <h4 className="font-medium">Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      Students receive confirmation and are redirected to a success page
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button asChild>
                  <Link href="/admissions" target="_blank">
                    View Student Application Form
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Admin Management */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Admin Management
              </CardTitle>
              <CardDescription>
                How administrators manage admission applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Access Admin Panel</h4>
                    <p className="text-sm text-muted-foreground">
                      Navigate to the Admissions section in the admin navigation
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Review Applications</h4>
                    <p className="text-sm text-muted-foreground">
                      View all applications in a table with filtering and search capabilities
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Update Status</h4>
                    <p className="text-sm text-muted-foreground">
                      Change application status to: Pending, Reviewed, Accepted, or Rejected
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">4</div>
                  <div>
                    <h4 className="font-medium">View Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Click "View" to see detailed application information and make status updates
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button asChild variant="outline">
                  <Link href="/admin/admissions">
                    Go to Admissions Management
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Application Statuses */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Application Statuses
              </CardTitle>
              <CardDescription>
                Understanding the different application statuses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Application has been submitted and is awaiting initial review
                  </p>
                </div>
                
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Reviewed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Application has been reviewed but final decision is pending
                  </p>
                </div>
                
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>Accepted</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Application has been accepted for admission
                  </p>
                </div>
                
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive">Rejected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Application has been rejected for admission
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Technical Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Technical Information
              </CardTitle>
              <CardDescription>
                Behind the scenes technical details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Database Table</h4>
                  <p className="text-sm text-muted-foreground">
                    Applications are stored in the <code className="bg-muted px-1 rounded">admissions_applications</code> table
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">API Endpoints</h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-1">
                    <li><code>POST /api/admissions/applications</code> - Submit new application</li>
                    <li><code>GET /api/admin/admissions/applications</code> - Get all applications</li>
                    <li><code>PATCH /api/admin/admissions/applications/[id]</code> - Update application status</li>
                    <li><code>GET /api/admin/admissions/stats</code> - Get application statistics</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Validation Rules</h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-1">
                    <li>All fields are required except message</li>
                    <li>Email must be valid format</li>
                    <li>Marks must be between 0 and 100</li>
                    <li>Aggregate is calculated automatically using the COMSATS formula</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}