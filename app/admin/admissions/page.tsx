"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BrandedBanner } from "@/components/layout/branded-banner"
import { toast } from "sonner"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Application {
  id: string
  full_name: string
  email: string
  phone: string
  cnic: string
  father_name: string
  campus_id: string
  department_id: string
  program_id: string
  matric_marks: number
  inter_marks: number
  entry_test_marks: number
  aggregate: number
  message: string | null
  status: string
  created_at: string
}

export default function AdminAdmissionsPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const response = await fetch("/api/admin/session")
      setIsAdmin(response.ok)
      
      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error("Error checking admin access:", error)
      setIsAdmin(false)
    }
  }

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/admissions/applications")
      const data = await response.json()
      
      if (response.ok) {
        setApplications(data)
      } else {
        toast.error("Failed to fetch applications", {
          description: data.error || "Could not load applications"
        })
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast.error("Network error", {
        description: "Failed to fetch applications"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/admissions/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setApplications(prev => 
          prev.map(app => 
            app.id === id ? { ...app, status } : app
          )
        )
        toast.success("Status updated", {
          description: "Application status has been updated successfully"
        })
      } else {
        toast.error("Failed to update status", {
          description: data.error || "Could not update application status"
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Network error", {
        description: "Failed to update application status"
      })
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesSearch = 
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.cnic.includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <BrandedBanner 
          title="Access Denied"
          description="You don't have permission to view this page"
          variant="gradient"
        />
        
        <main className="container mx-auto px-4 py-8">
          <Card className="glass-card max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Unauthorized Access</CardTitle>
              <CardDescription>
                Only administrators can access this page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Please contact your system administrator if you believe this is an error.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <BrandedBanner 
        title="Admissions Management"
        description="Manage student admission applications"
        variant="gradient"
      />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Admission Applications</CardTitle>
                <CardDescription>
                  Review and manage student applications
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, email, or CNIC..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-input"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="glass-select w-full md:w-32">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="rounded-md border glass-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Aggregate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No applications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>
                            <div className="font-medium">{app.full_name}</div>
                            <div className="text-sm text-muted-foreground">{app.father_name}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{app.email}</div>
                            <div className="text-sm text-muted-foreground">{app.phone}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">Program ID: {app.program_id.substring(0, 8)}...</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{app.aggregate}%</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                app.status === "accepted" ? "default" :
                                app.status === "rejected" ? "destructive" :
                                app.status === "reviewed" ? "secondary" : "outline"
                              }
                            >
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(app.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedApplication(app)}
                                >
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="glass-dialog max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Application Details</DialogTitle>
                                  <DialogDescription>
                                    Review application for {selectedApplication?.full_name}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedApplication && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Full Name</Label>
                                        <div className="mt-1 text-sm">{selectedApplication.full_name}</div>
                                      </div>
                                      
                                      <div>
                                        <Label>Father&apos;s Name</Label>
                                        <div className="mt-1 text-sm">{selectedApplication.father_name}</div>
                                      </div>
                                      
                                      <div>
                                        <Label>Email</Label>
                                        <div className="mt-1 text-sm">{selectedApplication.email}</div>
                                      </div>
                                      
                                      <div>
                                        <Label>Phone</Label>
                                        <div className="mt-1 text-sm">{selectedApplication.phone}</div>
                                      </div>
                                      
                                      <div>
                                        <Label>CNIC</Label>
                                        <div className="mt-1 text-sm">{selectedApplication.cnic}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Academic Marks</Label>
                                        <div className="mt-1 grid grid-cols-3 gap-2 text-sm">
                                          <div>
                                            <div className="text-muted-foreground">Matric</div>
                                            <div>{selectedApplication.matric_marks}%</div>
                                          </div>
                                          <div>
                                            <div className="text-muted-foreground">Intermediate</div>
                                            <div>{selectedApplication.inter_marks}%</div>
                                          </div>
                                          <div>
                                            <div className="text-muted-foreground">Entry Test</div>
                                            <div>{selectedApplication.entry_test_marks}%</div>
                                          </div>
                                        </div>
                                        <div className="mt-2">
                                          <div className="text-muted-foreground">Aggregate</div>
                                          <div className="text-lg font-bold">{selectedApplication.aggregate}%</div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Label>Status</Label>
                                        <div className="mt-1">
                                          <Select 
                                            value={selectedApplication.status}
                                            onValueChange={(value) => 
                                              updateApplicationStatus(selectedApplication.id, value)
                                            }
                                          >
                                            <SelectTrigger className="glass-select">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="pending">Pending</SelectItem>
                                              <SelectItem value="reviewed">Reviewed</SelectItem>
                                              <SelectItem value="accepted">Accepted</SelectItem>
                                              <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      
                                      {selectedApplication.message && (
                                        <div>
                                          <Label>Message</Label>
                                          <div className="mt-1 text-sm p-3 bg-muted rounded-md">
                                            {selectedApplication.message}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}