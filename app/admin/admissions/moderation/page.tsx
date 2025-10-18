"use client"

import { useState, useEffect } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminActionCard } from "@/components/admin/admin-action-card"
import { AdminLoading } from "@/components/admin/admin-loading"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { GlassCard } from "@/components/admin/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
import styles from './page.module.css';
  Shield, 
  Users, 
  FileText, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Search,
  Filter
} from "lucide-react"

interface ModerationItem {
  id: string
  type: "mentor" | "resource" | "question" | "review"
  title: string
  description: string
  status: "pending" | "approved" | "rejected"
  submittedBy: string
  submittedAt: string
  content?: string
  department?: string
  program?: string
}

import styles from "../../admin-shared.module.css"

export default function AdminAdmissionsModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Mock data for moderation items
  const mockItems: ModerationItem[] = [
    {
      id: "1",
      type: "mentor",
      title: "New Mentor Registration - Ahmed Raza",
      description: "Computer Science - BSCS",
      status: "pending",
      submittedBy: "ahmed.raza@student.com",
      submittedAt: "2024-05-15T14:30:00Z",
      content: "Experienced in NTS preparation and merit calculation. Available Mon, Wed, Fri."
    },
    {
      id: "2",
      type: "resource",
      title: "Study Notes - NTS Quantitative",
      description: "PDF file with practice questions",
      status: "pending",
      submittedBy: "sarah.khan@student.com",
      submittedAt: "2024-05-14T10:15:00Z",
      department: "All Departments",
      program: "All Programs"
    },
    {
      id: "3",
      type: "question",
      title: "Admission Query - Merit Calculation",
      description: "How to calculate merit for BBA program?",
      status: "pending",
      submittedBy: "bilal.ahmed@student.com",
      submittedAt: "2024-05-13T16:45:00Z",
      content: "Can you explain the merit calculation process for BBA? Is NTS required?"
    },
    {
      id: "4",
      type: "review",
      title: "Mentor Review - Fatima Khan",
      description: "Rating: 5 stars - Excellent guidance",
      status: "pending",
      submittedBy: "usman.ali@student.com",
      submittedAt: "2024-05-12T09:30:00Z",
      content: "Very helpful with NTS preparation. Provided excellent study materials."
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems(mockItems)
      setLoading(false)
    }, 1000)
  }, [])

  const handleApprove = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: "approved" } : item
    ))
  }

  const handleReject = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: "rejected" } : item
    ))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mentor":
        return Users
      case "resource":
        return FileText
      case "question":
        return MessageCircle
      case "review":
        return MessageCircle
      default:
        return AlertTriangle
    }
  }

  const getFilteredItems = () => {
    return items.filter(item => item.status === "pending")
  }

  return (
    <AdminGuard>
      <AdminPageHeader
        title="Admissions Moderation"
        description="Review and moderate content in the admissions module"
        icon={Shield}
        iconGradient="from-purple-600 to-indigo-600"
        badges={[
          {
            label: "Pending Items",
            value: getFilteredItems().length.toString(),
            icon: Clock,
            color: "border-yellow-200 dark:border-yellow-800"
          },
          {
            label: "Total Items",
            value: items.length.toString(),
            icon: Shield,
            color: "border-purple-200 dark:border-purple-800"
          }
        ]}
      />

      <div className={`${styles.section} ${styles.spaceY8} pb-12`}>
        <GlassCard 
          title="Moderation Queue" 
          description="Review pending content submissions"
          icon={Shield}
          iconGradient="from-purple-600 to-indigo-600"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {loading ? (
            <AdminLoading message="Loading moderation items..." />
          ) : getFilteredItems().length === 0 ? (
            <AdminEmptyState
              title="No Pending Items"
              description="All content has been reviewed and moderated"
              emoji="✅"
            />
          ) : (
            <div className="space-y-4">
              {getFilteredItems().map((item) => {
                const Icon = getTypeIcon(item.type)
                return (
                  <AdminActionCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    icon={Icon}
                    badges={[
                      {
                        label: item.type.charAt(0).toUpperCase() + item.type.slice(1),
                        variant: "outline"
                      },
                      {
                        label: `Submitted by ${item.submittedBy}`,
                        variant: "secondary"
                      }
                    ]}
                    actions={[
                      {
                        label: "Approve",
                        icon: CheckCircle,
                        onClick: () => handleApprove(item.id),
                        variant: "default",
                        className: "bg-green-600 hover:bg-green-700"
                      },
                      {
                        label: "Reject",
                        icon: XCircle,
                        onClick: () => handleReject(item.id),
                        variant: "destructive"
                      }
                    ]}
                    metadata={`Submitted ${new Date(item.submittedAt).toLocaleDateString()}`}
                    footer={
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          {item.department && (
                            <Badge variant="outline">{item.department}</Badge>
                          )}
                          {item.program && (
                            <Badge variant="outline">{item.program}</Badge>
                          )}
                        </div>
                        {item.content && (
                          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                            {item.content}
                          </p>
                        )}
                      </div>
                    }
                  />
                )
              })}
            </div>
          )}
        </GlassCard>
      </div>
    </AdminGuard>
  )
}