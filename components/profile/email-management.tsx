"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { 
  Mail, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Send,
  User,
  GraduationCap,
  AtSign,
  Info,
  Star
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface UserEmail {
  id: string
  email: string
  email_type: 'primary' | 'secondary' | 'personal'
  is_verified: boolean
  created_at: string
  updated_at: string
}

export function EmailManagement() {
  const { toast } = useToast()
  const [emails, setEmails] = useState<UserEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [addingEmail, setAddingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [emailType, setEmailType] = useState<'secondary' | 'personal'>('personal')
  const [settingPrimary, setSettingPrimary] = useState(false)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user-emails')
      if (response.ok) {
        const data = await response.json()
        setEmails(data)
      } else {
        const error = await response.json()
        
        // Show more helpful message for service unavailable
        if (response.status === 503) {
          toast({
            title: "Feature Unavailable",
            description: error.error || "Email management feature is being set up. Please try again later.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Error",
            description: error.error || "Failed to fetch email addresses",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch email addresses",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addEmail = async () => {
    if (!newEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }

    try {
      setAddingEmail(true)
      const response = await fetch('/api/user-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newEmail,
          email_type: emailType
        })
      })

      if (response.ok) {
        const data = await response.json()
        setEmails([...emails, data])
        setNewEmail("")
        toast({
          title: "Success",
          description: "Email address added successfully. A verification email has been sent."
        })
      } else {
        const error = await response.json()
        
        // Show more helpful message for service unavailable
        if (response.status === 503) {
          toast({
            title: "Feature Unavailable",
            description: error.error || "Email management feature is being set up. Please try again later.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Error",
            description: error.error || "Failed to add email address",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add email address",
        variant: "destructive"
      })
    } finally {
      setAddingEmail(false)
    }
  }

  const setAsPrimary = async (email: string) => {
    try {
      setSettingPrimary(true)
      const response = await fetch('/api/user-emails/set-primary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message
        })
        
        // Refresh the email list
        fetchEmails()
        
        // If verification is required, inform the user
        if (data.requires_verification) {
          toast({
            title: "Verification Required",
            description: "Please check your email for a verification link.",
            variant: "destructive"
          })
        }
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to set email as primary",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set email as primary",
        variant: "destructive"
      })
    } finally {
      setSettingPrimary(false)
    }
  }

  const removeEmail = async (emailId: string) => {
    try {
      const response = await fetch(`/api/user-emails?id=${emailId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEmails(emails.filter(email => email.id !== emailId))
        toast({
          title: "Success",
          description: "Email address removed successfully"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to remove email address",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove email address",
        variant: "destructive"
      })
    }
  }

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
        return 'Your institutional email address'
      case 'secondary':
        return 'Backup institutional email address'
      case 'personal':
        return 'Personal email address for alumni access'
      default:
        return 'Email address'
    }
  }

  if (loading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Management
          </CardTitle>
          <CardDescription>
            Manage your email addresses for account access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-32"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-500 rounded w-24"></div>
                </div>
                <div className="h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Management
        </CardTitle>
        <CardDescription>
          Manage your email addresses for account access. After graduation, you can use your personal email to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4" />
            Your Email Addresses
          </h3>
          
          {emails.map((email) => (
            <div 
              key={email.id} 
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700">
                  <AtSign className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">{email.email}</span>
                    {getTypeBadge(email.email_type)}
                    {email.is_verified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getTypeDescription(email.email_type)}
                    {!email.is_verified && email.email_type !== 'primary' && " - Pending verification"}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {email.email_type !== 'primary' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAsPrimary(email.email)}
                    disabled={settingPrimary}
                    className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    title="Set as Primary Email"
                  >
                    {settingPrimary ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                )}
                {email.email_type !== 'primary' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmail(email.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Email Address
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-white dark:bg-slate-900"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-type">Email Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={emailType === 'secondary' ? 'default' : 'outline'}
                  onClick={() => setEmailType('secondary')}
                  className={emailType === 'secondary' ? 'bg-purple-500 hover:bg-purple-600' : ''}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Secondary
                </Button>
                <Button
                  type="button"
                  variant={emailType === 'personal' ? 'default' : 'outline'}
                  onClick={() => setEmailType('personal')}
                  className={emailType === 'personal' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal
                </Button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {emailType === 'secondary' 
                  ? 'Backup institutional email (e.g., alternate department email)' 
                  : 'Personal email for alumni access after graduation'}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={addEmail}
            disabled={addingEmail || !newEmail}
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {addingEmail ? 'Adding...' : 'Add Email Address'}
          </Button>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Alumni Access</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                After graduation, your institutional email may become inactive. 
                Add a personal email address now to ensure continued access to your account and academic records.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}