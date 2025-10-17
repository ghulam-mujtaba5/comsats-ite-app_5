"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Mail, User, GraduationCap, CheckCircle, AlertCircle, X, Ban, Shield, RefreshCw, Filter } from "lucide-react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminActionCard } from "@/components/admin/admin-action-card"
import { AdminLoading } from "@/components/admin/admin-loading"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { useToast } from "@/hooks/use-toast"

interface UserEmail {
  id: string
  user_id: string
  email: string
  email_type: 'primary' | 'secondary' | 'personal'
  is_verified: boolean
  created_at: string
  updated_at: string
  user?: {
    email: string
    user_metadata?: {
      full_name?: string
    }
  }
}

import styles from "../admin-shared.module.css"

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState<UserEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/user-emails')
      if (response.ok) {
        const data = await response.json()
        setEmails(data)
      } else {
        throw new Error('Failed to fetch emails')
      }
    } catch (error) {
      console.error('Error fetching emails:', error)
      toast({
        title: "Error",
        description: "Failed to fetch email addresses",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const verifyEmail = async (emailId: string) => {
    try {
      const response = await fetch(`/api/admin/user-emails/${emailId}/verify`, {
        method: 'POST'
      })
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Email verified successfully"
        })
        fetchEmails()
      } else {
        throw new Error('Failed to verify email')
      }
    } catch (error) {
      console.error('Error verifying email:', error)
      toast({
        title: "Error",
        description: "Failed to verify email address",
        variant: "destructive"
      })
    }
  }

  const removeEmail = async (emailId: string) => {
    const confirmed = window.confirm("Are you sure you want to remove this email address?")
    if (!confirmed) return
    
    try {
      const response = await fetch(`/api/admin/user-emails/${emailId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Email removed successfully"
        })
        fetchEmails()
      } else {
        throw new Error('Failed to remove email')
      }
    } catch (error) {
      console.error('Error removing email:', error)
      toast({
        title: "Error",
        description: "Failed to remove email address",
        variant: "destructive"
      })
    }
  }

  const filteredEmails = emails.filter((email) => {
    const matchesSearch = email.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.user?.user_metadata?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === "all" || email.email_type === filterType
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "verified" && email.is_verified) || 
                         (filterStatus === "unverified" && !email.is_verified)
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'primary':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Primary</Badge>
      case 'secondary':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Secondary</Badge>
      case 'personal':
        return <Badge className="bg-green-500 hover:bg-green-600">Personal</Badge>
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>
    }
  }

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'primary':
        return 'Institutional email address'
      case 'secondary':
        return 'Backup institutional email address'
      case 'personal':
        return 'Personal email address for alumni access'
      default:
        return 'Email address'
    }
  }

  return (
    <AdminGuard>
      <AdminPageHeader
        title="Email Management"
        description="Manage user email addresses and verification status"
        icon={Mail}
        iconGradient="from-blue-600 to-purple-600"
        badges={[
          {
            label: "Total Emails",
            value: emails.length,
            icon: Mail,
            color: "border-blue-200 dark:border-blue-800"
          },
          {
            label: "Unverified",
            value: emails.filter(e => !e.is_verified).length,
            icon: AlertCircle,
            color: "border-yellow-200 dark:border-yellow-800"
          }
        ]}
      />
        
      <div className={`${styles.section} ${styles.spaceY8} pb-12`}>
        <Tabs defaultValue="emails" className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <TabsList className="glass-card bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 grid w-full lg:w-auto grid-cols-1">
              <TabsTrigger value="emails" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                <Mail className="h-4 w-4" />
                User Emails
              </TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <Input
                  placeholder="Search emails or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 w-full sm:w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 w-full sm:w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <TabsContent value="emails" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Email Addresses</h2>
                  <p className="text-slate-600 dark:text-slate-300">Manage all registered email addresses</p>
                </div>
              </div>
              
              <div className="grid gap-4">
                {loading ? (
                  <AdminLoading message="Loading email addresses..." />
                ) : filteredEmails.length > 0 ? (
                  filteredEmails.map((email) => {
                    const actions = []
                    
                    // Add verify action if not verified
                    if (!email.is_verified) {
                      actions.push({
                        label: "Verify",
                        icon: CheckCircle,
                        onClick: () => verifyEmail(email.id),
                        className: "bg-green-600 hover:bg-green-700 text-white"
                      })
                    }
                    
                    // Add remove action
                    actions.push({
                      label: "Remove",
                      icon: X,
                      onClick: () => removeEmail(email.id),
                      variant: "destructive" as const
                    })
                    
                    const badges: Array<{
                      label: string;
                      variant?: "default" | "secondary" | "destructive" | "outline";
                    }> = [
                      {
                        label: email.email_type,
                        variant: email.email_type === 'primary' ? 'default' : 
                                email.email_type === 'secondary' ? 'secondary' : 'outline'
                      }
                    ]
                    
                    if (!email.is_verified) {
                      badges.push({
                        label: "Unverified",
                        variant: "destructive"
                      })
                    }
                    
                    return (
                      <AdminActionCard
                        key={email.id}
                        title={email.user?.user_metadata?.full_name || 'Unnamed User'}
                        description={`${email.email} (${email.user?.email})`}
                        icon={email.is_verified ? CheckCircle : AlertCircle}
                        badges={badges}
                        actions={actions}
                        metadata={`Added ${new Date(email.created_at).toLocaleDateString()} • ${getTypeDescription(email.email_type)}`}
                        isProblematic={!email.is_verified}
                      />
                    )
                  })
                ) : (
                  <AdminEmptyState
                    title="No Emails Found"
                    description="No email addresses match your search criteria."
                    emoji="📧"
                  />
                )}  
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  )
}