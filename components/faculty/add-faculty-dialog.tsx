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
import { UserPlus, Loader2, Plus, Info, Book, Award, MapPin } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useCampus } from '@/contexts/campus-context'
import { departments } from '@/lib/faculty-data'
import { Card } from '@/components/ui/card'

export function AddFacultyDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const { user } = useAuth()
  const { selectedCampus } = useCampus()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    department: '',
    email: '',
    office: '',
    phone: '',
    specialization: '',
    courses: '',
    education: '',
    experience: '',
    profile_image: ''
  })

  const actualOpen = open !== undefined ? open : isOpen
  const actualOnOpenChange = onOpenChange || setIsOpen

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
          campus_id: selectedCampus.id,
          submitted_by: user.id,
          // Convert semicolon-separated strings to arrays for the backend
          specialization: formData.specialization ? formData.specialization.split(';').map(s => s.trim()).filter(Boolean) : [],
          courses: formData.courses ? formData.courses.split(';').map(c => c.trim()).filter(Boolean) : [],
          education: formData.education ? formData.education.split(';').map(e => e.trim()).filter(Boolean) : []
        })
      })

      const result = await response.json()

      if (response.ok) {
        alert('Faculty member submitted for admin approval! You\'ll be able to review them once approved.')
        setFormData({
          name: '',
          title: '',
          department: '',
          email: '',
          office: '',
          phone: '',
          specialization: '',
          courses: '',
          education: '',
          experience: '',
          profile_image: ''
        })
        actualOnOpenChange(false)
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
    <Dialog open={actualOpen} onOpenChange={actualOnOpenChange}>
      <DialogTrigger asChild>
        {/* Hidden trigger since we're using the card */}
        <div className="hidden" />
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-r from-primary to-blue-600 p-6 rounded-t-lg">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl text-white">Add New Faculty Member</DialogTitle>
            <DialogDescription className="text-blue-100">
              Is a faculty member missing from our directory? Submit their information for admin approval.
              Once approved, you and other students can write reviews.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Doe"
                required
                className="h-12 text-base border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Professor"
                className="h-12 text-base border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-base font-medium">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className="h-12 text-base border-2 focus:border-primary transition-colors">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.filter(d => d !== "All").map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@comsats.edu.pk"
                className="h-12 text-base border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="office" className="text-base font-medium">Office Location (Optional)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="office"
                  value={formData.office}
                  onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                  placeholder="CS-201"
                  className="h-12 text-base border-2 focus:border-primary transition-colors pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-medium">Phone (Optional)</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="h-12 text-base border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-base font-medium">Specialization (Optional)</Label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="AI; Machine Learning; Data Science"
                  className="h-12 text-base border-2 focus:border-primary transition-colors pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">Separate multiple specializations with semicolons</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courses" className="text-base font-medium">Courses (Optional)</Label>
              <div className="relative">
                <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="courses"
                  value={formData.courses}
                  onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
                  placeholder="CS101; CS102; CS301"
                  className="h-12 text-base border-2 focus:border-primary transition-colors pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">Separate multiple courses with semicolons</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education" className="text-base font-medium">Education (Optional)</Label>
            <Input
              id="education"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              placeholder="PhD Computer Science; MS Software Engineering"
              className="h-12 text-base border-2 focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground">Separate multiple qualifications with semicolons</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-base font-medium">Experience (Optional)</Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="10+ years in academia and industry"
              className="h-12 text-base border-2 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile_image" className="text-base font-medium">Profile Image URL (Optional)</Label>
            <Input
              id="profile_image"
              value={formData.profile_image}
              onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
              placeholder="https://example.com/photo.jpg"
              className="h-12 text-base border-2 focus:border-primary transition-colors"
            />
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Approval Process</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your submission will be reviewed by administrators. Once approved, the faculty member 
                  will appear in the directory for all students to review. This typically takes 1-2 business days.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => actualOnOpenChange(false)}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-base border-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2.5 text-base bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Submit for Approval
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}