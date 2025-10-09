"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  AlertTriangle, 
  Shield, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Flag,
  UserX,
  MessageSquare,
  Users,
  Calendar,
  BarChart3
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Report {
  id: string
  type: "post" | "comment" | "user" | "group" | "event" | "poll"
  content: string
  reason: string
  reporter: string
  status: "pending" | "reviewed" | "resolved" | "dismissed"
  createdAt: string
  targetId: string
}

interface ModerationAction {
  id: string
  action: "delete" | "hide" | "warn" | "ban" | "lock"
  reason: string
  moderator: string
  createdAt: string
  targetId: string
}

export function ModerationTools() {
  const [activeTab, setActiveTab] = useState<"reports" | "actions" | "settings">("reports")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [moderationReason, setModerationReason] = useState("")
  const [moderationAction, setModerationAction] = useState<"delete" | "hide" | "warn" | "ban" | "lock">("delete")

  // Mock data for reports
  const mockReports: Report[] = [
    {
      id: "1",
      type: "post",
      content: "This post contains inappropriate content...",
      reason: "Inappropriate content",
      reporter: "student123",
      status: "pending",
      createdAt: "2025-10-09T10:30:00Z",
      targetId: "post-123"
    },
    {
      id: "2",
      type: "comment",
      content: "Offensive comment about...",
      reason: "Harassment",
      reporter: "user456",
      status: "pending",
      createdAt: "2025-10-09T09:15:00Z",
      targetId: "comment-456"
    },
    {
      id: "3",
      type: "user",
      content: "User spamming inappropriate content",
      reason: "Spam",
      reporter: "moderator789",
      status: "reviewed",
      createdAt: "2025-10-08T14:20:00Z",
      targetId: "user-789"
    }
  ]

  const handleModerationAction = () => {
    if (!selectedReport) {
      toast({
        title: "No report selected",
        description: "Please select a report to moderate",
        variant: "destructive"
      })
      return
    }

    if (!moderationReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for the moderation action",
        variant: "destructive"
      })
      return
    }

    // In a real application, this would call an API
    toast({
      title: "Moderation action taken",
      description: `Action: ${moderationAction} - Reason: ${moderationReason}`
    })

    // Reset form
    setSelectedReport(null)
    setModerationReason("")
  }

  const handleReportStatusChange = (reportId: string, status: Report["status"]) => {
    // In a real application, this would call an API
    toast({
      title: "Report status updated",
      description: `Report ${reportId} marked as ${status}`
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Community Moderation</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Flag className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Reports</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Actions Taken</p>
                <p className="text-2xl font-bold">48</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Moderators</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "reports" ? "default" : "ghost"}
          onClick={() => setActiveTab("reports")}
          className="gap-2"
        >
          <Flag className="h-4 w-4" />
          Reports
        </Button>
        <Button
          variant={activeTab === "actions" ? "default" : "ghost"}
          onClick={() => setActiveTab("actions")}
          className="gap-2"
        >
          <Shield className="h-4 w-4" />
          Actions
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "ghost"}
          onClick={() => setActiveTab("settings")}
          className="gap-2"
        >
          <Lock className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {activeTab === "reports" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>Review and take action on reported content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div 
                    key={report.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedReport?.id === report.id 
                        ? "bg-primary/10 border-primary" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="h-3 w-3" />
                            {report.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            report.status === "pending" 
                              ? "bg-yellow-100 text-yellow-800"
                              : report.status === "reviewed"
                              ? "bg-blue-100 text-blue-800"
                              : report.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="font-medium">{report.content}</p>
                        <p className="text-sm text-muted-foreground">
                          Reported by: {report.reporter} • Reason: {report.reason}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReportStatusChange(report.id, "resolved")
                        }}
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedReport && (
            <Card>
              <CardHeader>
                <CardTitle>Take Moderation Action</CardTitle>
                <CardDescription>
                  Select an action for the reported {selectedReport.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Content Type</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedReport.type === "post" && <MessageSquare className="h-4 w-4" />}
                      {selectedReport.type === "comment" && <MessageSquare className="h-4 w-4" />}
                      {selectedReport.type === "user" && <Users className="h-4 w-4" />}
                      {selectedReport.type === "group" && <Users className="h-4 w-4" />}
                      {selectedReport.type === "event" && <Calendar className="h-4 w-4" />}
                      {selectedReport.type === "poll" && <BarChart3 className="h-4 w-4" />}
                      <span className="capitalize">{selectedReport.type}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Content</Label>
                    <div className="mt-1 p-3 bg-muted rounded-lg">
                      {selectedReport.content}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Reporter</Label>
                    <p className="mt-1">{selectedReport.reporter}</p>
                  </div>
                  
                  <div>
                    <Label>Reason</Label>
                    <p className="mt-1">{selectedReport.reason}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <RadioGroup 
                    value={moderationAction} 
                    onValueChange={(value) => setModerationAction(value as any)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delete" id="delete" />
                      <Label htmlFor="delete" className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        Delete Content
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hide" id="hide" />
                      <Label htmlFor="hide" className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-yellow-500" />
                        Hide Content
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="warn" id="warn" />
                      <Label htmlFor="warn" className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Warn User
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ban" id="ban" />
                      <Label htmlFor="ban" className="flex items-center gap-2">
                        <UserX className="h-4 w-4 text-red-500" />
                        Ban User
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lock" id="lock" />
                      <Label htmlFor="lock" className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-blue-500" />
                        Lock Discussion
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  <div>
                    <Label htmlFor="reason">Reason for Action</Label>
                    <Textarea
                      id="reason"
                      placeholder="Explain why this moderation action is being taken..."
                      value={moderationReason}
                      onChange={(e) => setModerationReason(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleModerationAction}>
                      Take Action
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedReport(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "actions" && (
        <Card>
          <CardHeader>
            <CardTitle>Moderation Actions</CardTitle>
            <CardDescription>Recent moderation actions taken by moderators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Deleted inappropriate post</p>
                    <p className="text-sm text-muted-foreground">
                      By moderator_john • 2 hours ago
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Warned user for spam</p>
                    <p className="text-sm text-muted-foreground">
                      By moderator_sarah • 1 day ago
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                    <AlertTriangle className="h-3 w-3" />
                    Warn
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Hidden offensive comment</p>
                    <p className="text-sm text-muted-foreground">
                      By moderator_mike • 2 days ago
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    <EyeOff className="h-3 w-3" />
                    Hide
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "settings" && (
        <Card>
          <CardHeader>
            <CardTitle>Moderation Settings</CardTitle>
            <CardDescription>Configure community moderation policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-moderation</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically flag content with sensitive keywords
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Report Threshold</h3>
                  <p className="text-sm text-muted-foreground">
                    Number of reports before auto-hiding content
                  </p>
                </div>
                <select className="border rounded-md px-3 py-1">
                  <option>3 reports</option>
                  <option>5 reports</option>
                  <option>10 reports</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Moderator Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Email alerts for new reports
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-3">Blocked Words</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add blocked word..." 
                  className="flex-1 border rounded-md px-3 py-2"
                />
                <Button size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["spam", "offensive", "inappropriate"].map((word) => (
                  <span 
                    key={word} 
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted"
                  >
                    {word}
                    <button className="text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}