"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Clock, Loader2, UserCheck, UserX } from 'lucide-react'

interface PendingFaculty {
  id: string
  name: string
  department: string
  designation: string
  email?: string
  phone?: string
  specialization?: string
  qualifications?: string
  campus: { name: string; code: string }
  submitter: { email: string; full_name?: string }
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  reviewer_notes?: string
}

export default function PendingFacultyReviewPage() {
  const [pendingFaculty, setPendingFaculty] = useState<PendingFaculty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({})
  const [hasAccess, setHasAccess] = useState(true) // Will be verified by API
  const [accessError, setAccessError] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingFaculty()
  }, [])

  const fetchPendingFaculty = async () => {
    try {
      const response = await fetch('/api/admin/faculty/pending?status=pending')
      if (response.status === 401) {
        setHasAccess(false)
        setAccessError('You do not have admin permissions to access this page.')
      } else if (response.ok) {
        const data = await response.json()
        setPendingFaculty(data.pendingFaculty || [])
        setHasAccess(true)
      } else {
        const data = await response.json()
        setAccessError(data.error || 'Failed to fetch pending faculty')
      }
    } catch (error) {
      console.error('Error fetching pending faculty:', error)
      setAccessError('Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (facultyId: string, action: 'approve' | 'reject') => {
    setProcessingId(facultyId)
    try {
      const response = await fetch('/api/admin/faculty/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingFacultyId: facultyId,
          action,
          reviewerNotes: reviewNotes[facultyId] || ''
        })
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message)
        // Refresh list
        fetchPendingFaculty()
        // Clear notes
        setReviewNotes(prev => {
          const newNotes = { ...prev }
          delete newNotes[facultyId]
          return newNotes
        })
      } else {
        alert(result.error || `Failed to ${action} faculty`)
      }
    } catch (error) {
      console.error(`Error ${action}ing faculty:`, error)
      alert(`Failed to ${action} faculty`)
    } finally {
      setProcessingId(null)
    }
  }

  if (!hasAccess) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {accessError || 'You don\'t have admin permissions to access this page.'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Pending Faculty Submissions
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Review and approve faculty members submitted by students
        </p>
      </div>

      {pendingFaculty.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No Pending Submissions
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              All faculty submissions have been reviewed
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingFaculty.map((faculty) => (
            <Card key={faculty.id} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{faculty.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {faculty.designation} • {faculty.department}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-400">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Faculty Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Campus</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {faculty.campus.name} ({faculty.campus.code})
                    </p>
                  </div>
                  {faculty.email && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{faculty.email}</p>
                    </div>
                  )}
                  {faculty.specialization && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Specialization</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{faculty.specialization}</p>
                    </div>
                  )}
                  {faculty.qualifications && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Qualifications</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{faculty.qualifications}</p>
                    </div>
                  )}
                </div>

                {/* Submitter Info */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Submitted by:</strong> {faculty.submitter.full_name || faculty.submitter.email}
                    {' • '}
                    {new Date(faculty.submitted_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Review Notes */}
                <div className="space-y-2">
                  <Label htmlFor={`notes-${faculty.id}`}>Review Notes (Optional)</Label>
                  <Textarea
                    id={`notes-${faculty.id}`}
                    value={reviewNotes[faculty.id] || ''}
                    onChange={(e) => setReviewNotes(prev => ({
                      ...prev,
                      [faculty.id]: e.target.value
                    }))}
                    placeholder="Add notes about this submission..."
                    rows={2}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => handleAction(faculty.id, 'approve')}
                    disabled={processingId === faculty.id}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {processingId === faculty.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-2" />
                    )}
                    Approve & Add to Faculty List
                  </Button>
                  <Button
                    onClick={() => handleAction(faculty.id, 'reject')}
                    disabled={processingId === faculty.id}
                    variant="destructive"
                    className="flex-1"
                  >
                    {processingId === faculty.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserX className="h-4 w-4 mr-2" />
                    )}
                    Reject Submission
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
