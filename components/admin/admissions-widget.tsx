"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, TrendingUp, Users } from "lucide-react"

interface AdmissionStats {
  total: number
  pending: number
  reviewed: number
  accepted: number
  rejected: number
}

export function AdmissionsWidget() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState<AdmissionStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const response = await fetch("/api/admin/session")
      setIsAdmin(response.ok)
      
      if (response.ok) {
        fetchStats()
      }
    } catch (error) {
      console.error("Error checking admin access:", error)
      setIsAdmin(false)
    }
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/admissions/stats")
      const data = await response.json()
      
      if (response.ok) {
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching admission stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) return null

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Admissions
            </CardTitle>
            <CardDescription>Recent application statistics</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/admissions">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : stats ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Applications</span>
              </div>
              <Badge variant="secondary" className="text-lg">
                {stats.total}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <Badge variant="outline">{stats.pending}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reviewed</span>
                <Badge variant="outline">{stats.reviewed}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Accepted</span>
                <Badge variant="default">{stats.accepted}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rejected</span>
                <Badge variant="destructive">{stats.rejected}</Badge>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>
                  {stats.pending > 0 
                    ? `${stats.pending} pending review` 
                    : "All applications reviewed"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            No admission data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}