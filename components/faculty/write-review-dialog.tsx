"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Plus, X, PenTool, LogIn, CheckCircle } from "lucide-react"
import type { Faculty } from "@/lib/faculty-data"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface WriteReviewDialogProps {
  faculty: Faculty
  children: React.ReactNode
  onSubmitted?: () => void
}

export function WriteReviewDialog({ faculty, children, onSubmitted }: WriteReviewDialogProps) {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [formData, setFormData] = useState({
    course: "",
    semester: "Fall 2023",
    rating: 0,
    teachingQuality: 0,
    accessibility: 0,
    courseMaterial: 0,
    grading: 0,
    comment: "",
    pros: [] as string[],
    cons: [] as string[],
    newPro: "",
    newCon: "",
    wouldRecommend: false,
    isAnonymous: false,
  })

  const handleRatingChange = (category: string, rating: number) => {
    setFormData((prev) => ({ ...prev, [category]: rating }))
  }

  const addPro = () => {
    if (formData.newPro.trim() && !formData.pros.includes(formData.newPro.trim())) {
      setFormData((prev) => ({
        ...prev,
        pros: [...prev.pros, prev.newPro.trim()],
        newPro: "",
      }))
    }
  }

  const addCon = () => {
    if (formData.newCon.trim() && !formData.cons.includes(formData.newCon.trim())) {
      setFormData((prev) => ({
        ...prev,
        cons: [...prev.cons, prev.newCon.trim()],
        newCon: "",
      }))
    }
  }

  const removePro = (proToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      pros: prev.pros.filter((pro) => pro !== proToRemove),
    }))
  }

  const removeCon = (conToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      cons: prev.cons.filter((con) => con !== conToRemove),
    }))
  }

  const renderStarRating = (category: string, currentRating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleRatingChange(category, i + 1)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                i < currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium">{currentRating}/5</span>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      setSubmitting(true)
      const payload = {
        faculty_id: faculty.id,
        student_id: user.id,
        student_name: formData.isAnonymous ? null : (user.email?.split("@")[0] ?? null),
        course: formData.course,
        semester: formData.semester,
        rating: formData.rating,
        teaching_quality: formData.teachingQuality,
        accessibility: formData.accessibility,
        course_material: formData.courseMaterial,
        grading: formData.grading,
        comment: formData.comment,
        pros: formData.pros,
        cons: formData.cons,
        would_recommend: formData.wouldRecommend,
        is_anonymous: formData.isAnonymous,
      }
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Failed with status ${res.status}`)
      }
      toast({ title: "Review submitted", description: "Thanks for your feedback!" })
      setShowSuccessDialog(true)
      // Inform parent (client page) to refetch
      try { onSubmitted?.() } catch (_) {}
      // Also refresh in case parent is a server component somewhere up the tree
      router.refresh()
    } catch (err: any) {
      toast({ title: "Failed to submit", description: err.message ?? "Unknown error", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleTriggerClick = () => {
    if (!isAuthenticated) {
      // Don't open dialog if not authenticated
      return
    }
    setOpen(true)
  }

  if (!isAuthenticated) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div onClick={handleTriggerClick}>{children}</div>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-primary" />
              Sign In Required
            </DialogTitle>
            <DialogDescription>You need to sign in with your COMSATS email to write faculty reviews.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Only verified COMSATS students can write reviews to ensure authenticity and prevent spam.
            </p>
            <Button asChild>
              <Link href="/auth">Sign In with University Email</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const closeDialogsAndReset = () => {
    setShowSuccessDialog(false)
    setOpen(false)
    setFormData({
      course: "",
      semester: "Fall 2023",
      rating: 0,
      teachingQuality: 0,
      accessibility: 0,
      courseMaterial: 0,
      grading: 0,
      comment: "",
      pros: [] as string[],
      cons: [] as string[],
      newPro: "",
      newCon: "",
      wouldRecommend: false,
      isAnonymous: false,
    })
  }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            Write Review for {faculty.name}
          </DialogTitle>
          <DialogDescription>
            Share your experience to help fellow students make informed decisions. Your review will be moderated before
            publication.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course">Course *</Label>
              <Select
                value={formData.course}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, course: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {faculty.courses.map((course, index) => (
                    <SelectItem key={index} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="semester">Semester *</Label>
              <Select
                value={formData.semester}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, semester: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall 2023">Fall 2023</SelectItem>
                  <SelectItem value="Spring 2023">Spring 2023</SelectItem>
                  <SelectItem value="Fall 2022">Fall 2022</SelectItem>
                  <SelectItem value="Spring 2022">Spring 2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ratings *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Overall Rating</Label>
                {renderStarRating("rating", formData.rating)}
              </div>
              <div>
                <Label>Teaching Quality</Label>
                {renderStarRating("teachingQuality", formData.teachingQuality)}
              </div>
              <div>
                <Label>Accessibility</Label>
                {renderStarRating("accessibility", formData.accessibility)}
              </div>
              <div>
                <Label>Course Material</Label>
                {renderStarRating("courseMaterial", formData.courseMaterial)}
              </div>
              <div>
                <Label>Grading Fairness</Label>
                {renderStarRating("grading", formData.grading)}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Review Comment *</Label>
            <Textarea
              id="comment"
              placeholder="Share your detailed experience with this faculty member..."
              value={formData.comment}
              onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Pros</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a positive point"
                  value={formData.newPro}
                  onChange={(e) => setFormData((prev) => ({ ...prev, newPro: e.target.value }))}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPro())}
                />
                <Button type="button" onClick={addPro} className="bg-transparent border">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.pros.map((pro, index) => (
                  <Badge key={index} className="bg-green-50 text-green-700 border-green-200">
                    {pro}
                    <button type="button" onClick={() => removePro(pro)} className="ml-1 hover:text-blue-600">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Cons</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a negative point"
                  value={formData.newCon}
                  onChange={(e) => setFormData((prev) => ({ ...prev, newCon: e.target.value }))}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCon())}
                />
                <Button type="button" onClick={addCon} className="bg-transparent border">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cons.map((con, index) => (
                  <Badge key={index} className="bg-blue-50 text-blue-700 border-blue-200">
                    {con}
                    <button type="button" onClick={() => removeCon(con)} className="ml-1 hover:text-blue-600">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recommend"
                checked={formData.wouldRecommend}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, wouldRecommend: !!checked }))}
              />
              <Label htmlFor="recommend">I would recommend this faculty member to other students</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.isAnonymous}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isAnonymous: !!checked }))}
              />
              <Label htmlFor="anonymous">Submit this review anonymously</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" onClick={() => setOpen(false)} className="bg-transparent border">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Review"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Review Submitted!
            </DialogTitle>
            <DialogDescription className="pt-2">
              Thank you for sharing your experience. Your review will be moderated and published shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <Button className="w-full" onClick={closeDialogsAndReset}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
