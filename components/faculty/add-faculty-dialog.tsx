"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useCampus } from '@/contexts/campus-context'

export function AddFacultyDialog() {
  const { user } = useAuth()
  const { selectedCampus } = useCampus()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    designation: 'Lecturer',
    email: '',
    phone: '',
    specialization: '',
    qualifications: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      alert('Please sign in to submit a faculty member')
      return
    }

    if (!selectedCampus) {
      alert('Please select a campus before submitting')
      return
    }

    if (!formData.name || !formData.department) {
      alert('Name and department are required')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/faculty/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          campus_id: selectedCampus.id, // Use selectedCampus.id instead of selectedCampus object
          submitted_by: user.id
        })
      })

      const result = await response.json()

      if (response.ok) {
        alert('Faculty member submitted for admin approval! You\'ll be able to review them once approved.')
        setFormData({
          name: '',
          department: '',
          designation: 'Lecturer',
          email: '',
          phone: '',
          specialization: '',
          qualifications: ''
        })
        setOpen(false)
      } else {
        alert(result.error || 'Failed to submit faculty')
      }
    } catch (error) {
      console.error('Error submitting faculty:', error)
      alert('Failed to submit faculty for approval')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Faculty Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit New Faculty Member</DialogTitle>
          <DialogDescription>
            Faculty member not in the list? Submit their information for admin approval.
            Once approved, you and other students can write reviews.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Computer Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Select
                value={formData.designation}
                onValueChange={(value) => setFormData({ ...formData, designation: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professor">Professor</SelectItem>
                  <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                  <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                  <SelectItem value="Lecturer">Lecturer</SelectItem>
                  <SelectItem value="Visiting Faculty">Visiting Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@comsats.edu.pk"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization (Optional)</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Machine Learning, AI"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualifications">Qualifications (Optional)</Label>
            <Textarea
              id="qualifications"
              value={formData.qualifications}
              onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              placeholder="PhD in Computer Science from..."
              rows={3}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Your submission will be reviewed by administrators. 
              Once approved, the faculty member will appear in the list for all students to review.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit for Approval'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}