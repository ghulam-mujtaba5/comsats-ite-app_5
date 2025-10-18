"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Edit3, Loader2, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Campus {
  id: string
  name: string
  location: string
}

interface Department {
  id: string
  name: string
  code: string
}

interface Program {
  id: string
  name: string
  degree_level: string
}

export function EditProfileDialog() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form data
  const [fullName, setFullName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [campusId, setCampusId] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [programId, setProgramId] = useState('')
  const [semester, setSemester] = useState('')
  
  // Dropdown data
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [programs, setPrograms] = useState<Program[]>([])

  // Fetch profile data and dropdown options
  useEffect(() => {
    if (open) {
      fetchProfileData()
      fetchCampuses()
    }
  }, [open])

  useEffect(() => {
    if (campusId) {
      fetchDepartments(campusId)
    }
  }, [campusId])

  useEffect(() => {
    if (departmentId) {
      fetchPrograms(departmentId)
    }
  }, [departmentId])

  const fetchProfileData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/account')
      if (response.ok) {
        const data = await response.json()
        setFullName(data.user_metadata?.full_name || '')
        setStudentId(data.user_metadata?.student_id || '')
        setCampusId(data.preferences?.campus_id || '')
        setDepartmentId(data.preferences?.department_id || '')
        setProgramId(data.preferences?.program_id || '')
        setSemester(data.preferences?.semester?.toString() || '')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCampuses = async () => {
    try {
      const response = await fetch('/api/campuses')
      if (response.ok) {
        const data = await response.json()
        setCampuses(data)
      }
    } catch (error) {
      console.error('Error fetching campuses:', error)
    }
  }

  const fetchDepartments = async (campus_id: string) => {
    try {
      const response = await fetch(`/api/departments?campus_id=${campus_id}`)
      if (response.ok) {
        const data = await response.json()
        setDepartments(data)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const fetchPrograms = async (department_id: string) => {
    try {
      const response = await fetch(`/api/programs?department_id=${department_id}`)
      if (response.ok) {
        const data = await response.json()
        setPrograms(data)
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          student_id: studentId,
          campus_id: campusId,
          department_id: departmentId,
          program_id: programId,
          semester: semester ? parseInt(semester) : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        setOpen(false)
        // Trigger page reload to refresh stats
        window.location.reload()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="rounded-xl border-slate-200 dark:border-slate-700 dark:border-slate-700/30 hover:bg-white/10 dark:hover:bg-slate-800/50"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-700 dark:border-slate-700/30 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your academic profile and campus information
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="rounded-xl"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g., FA21-BSE-123"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="campus">Campus</Label>
              <Select value={campusId} onValueChange={setCampusId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select campus" />
                </SelectTrigger>
                <SelectContent>
                  {campuses.map((campus) => (
                    <SelectItem key={campus.id} value={campus.id}>
                      {campus.name} - {campus.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={departmentId} 
                onValueChange={setDepartmentId}
                disabled={!campusId}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="program">Program</Label>
              <Select 
                value={programId} 
                onValueChange={setProgramId}
                disabled={!departmentId}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name} ({program.degree_level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="semester">Current Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-xl"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            disabled={saving || loading}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
