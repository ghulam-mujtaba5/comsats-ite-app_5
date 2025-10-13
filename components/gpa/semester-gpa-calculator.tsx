"use client"

import { useMemo, useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Calculator, Trophy, Zap, Flame } from "lucide-react"
import { type Course, GRADES, calculateSemesterGPA, getGradeFromGPA } from "@/lib/gpa-utils"
import { useEmotion } from "@/contexts/emotion-context"
import { useAnimation } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "@/components/motivational/unified-feedback-system"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"

export function SemesterGPACalculator() {
  const [courses, setCourses] = useState<Course[]>([{ id: "1", name: "", creditHours: 3, grade: "" }])
  const [studyTime, setStudyTime] = useState(0) // Track study time in minutes
  const [startTime, setStartTime] = useState<number | null>(null)

  const { emotionState, updateEmotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()
  const { triggerFeedback } = useMotivationalFeedback()
  const { triggerConfetti, triggerBalloons, triggerFlickeringLights } = useCelebrationAnimations()

  // Track study time
  useEffect(() => {
    if (courses.length > 1 && !startTime) {
      setStartTime(Date.now())
    }
    
    return () => {
      if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 60000) // Convert to minutes
        setStudyTime(prev => prev + elapsed)
      }
    }
  }, [courses.length, startTime])

  const validCourses = useMemo(
    () => courses.filter((course) => course.grade && course.creditHours > 0),
    [courses],
  )

  const liveResult = useMemo(() => {
    if (validCourses.length === 0) return null
    return calculateSemesterGPA(validCourses)
  }, [validCourses])

  // Track user activity for emotion detection
  const trackActivity = useCallback((activity: string) => {
    // Update emotion state based on activity
    switch (activity) {
      case 'course_added':
        updateEmotionState({
          motivationLevel: emotionState.motivationLevel === 'low' ? 'medium' : emotionState.motivationLevel,
          focusLevel: emotionState.focusLevel === 'low' ? 'medium' : emotionState.focusLevel
        })
        break
      case 'grade_entered':
        updateEmotionState({
          motivationLevel: emotionState.motivationLevel === 'low' ? 'medium' : emotionState.motivationLevel
        })
        break
      case 'high_gpa':
        updateEmotionState({
          mood: 'happy',
          motivationLevel: 'high'
        })
        break
      case 'low_gpa':
        updateEmotionState({
          mood: 'sad',
          stressLevel: emotionState.stressLevel === 'low' ? 'medium' : emotionState.stressLevel
        })
        break
    }
  }, [emotionState, updateEmotionState])

  const addCourse = useCallback(() => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: "",
      creditHours: 3,
      grade: "",
    }
    setCourses(prev => [...prev, newCourse])
    trackActivity('course_added')
  }, [trackActivity])

  const removeCourse = useCallback((id: string) => {
    if (courses.length > 1) {
      setCourses(prev => prev.filter((course) => course.id !== id))
    }
  }, [courses.length])

  const updateCourse = useCallback((id: string, field: keyof Course, value: string | number) => {
    setCourses(prev => prev.map((course) => (course.id === id ? { ...course, [field]: value } : course)))
    
    // Track grade entry activity
    if (field === "grade" && value) {
      trackActivity('grade_entered')
    }
  }, [trackActivity])

  const resetCalculator = useCallback(() => {
    setCourses([{ id: "1", name: "", creditHours: 3, grade: "" }])
    setStartTime(null)
    setStudyTime(0)
  }, [])

  // Show motivational feedback when GPA is calculated
  useEffect(() => {
    if (liveResult) {
      // Trigger emotion-based responses
      if (liveResult.gpa >= 3.5) {
        trackActivity('high_gpa')
        
        // Trigger celebration animations
        triggerConfetti({
          message: "Excellent Work! 🎉",
          duration: 5000,
          particleCount: 200
        })
        
        // Trigger motivational feedback
        triggerFeedback({
          type: 'achievement_unlocked',
          message: `Outstanding GPA: ${liveResult.gpa.toFixed(2)}!`
        })
      } else if (liveResult.gpa >= 3.0) {
        trackActivity('high_gpa')
        
        // Trigger positive animation
        triggerFlickeringLights({
          message: "Good job! Keep it up! ✨",
          duration: 3000
        })
        
        // Trigger motivational feedback
        triggerFeedback({
          type: 'goal_reached',
          message: `Great GPA: ${liveResult.gpa.toFixed(2)}!`
        })
      } else if (liveResult.gpa >= 2.0) {
        // Neutral response
        triggerFeedback({
          type: 'challenge_completed',
          message: `GPA: ${liveResult.gpa.toFixed(2)}. You can do better!`
        })
      } else {
        trackActivity('low_gpa')
        
        // Trigger supportive animation
        triggerAnimation({
          type: 'sparkles',
          message: "Don't give up! You've got this! 💪",
          duration: 4000
        })
        
        // Trigger motivational feedback
        triggerFeedback({
          type: 'low_motivation',
          message: `GPA: ${liveResult.gpa.toFixed(2)}. Let's work on improvement!`
        })
      }
    }
  }, [liveResult, trackActivity, triggerConfetti, triggerFlickeringLights, triggerAnimation, triggerFeedback])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Semester GPA Calculator
        </CardTitle>
        <CardDescription>Calculate your GPA for a single semester by entering your courses and grades</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div key={course.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 border border-border rounded-lg">
              <div className="md:col-span-5">
                <Label htmlFor={`course-${course.id}`} className="text-sm">Course Name</Label>
                <Input
                  id={`course-${course.id}`}
                  placeholder="e.g., Data Structures"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor={`credits-${course.id}`} className="text-sm">Credit Hours</Label>
                <Input
                  id={`credits-${course.id}`}
                  type="number"
                  min="1"
                  max="6"
                  value={course.creditHours}
                  onChange={(e) => updateCourse(course.id, "creditHours", Number.parseInt(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>

              <div className="md:col-span-3">
                <Label htmlFor={`grade-${course.id}`} className="text-sm">Grade</Label>
                <Select value={course.grade} onValueChange={(value) => updateCourse(course.id, "grade", value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade} className="text-sm">
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length === 1}
                  className="w-full text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={addCourse} className="flex-1 bg-transparent text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
          <Button variant="outline" onClick={resetCalculator} className="flex-1 bg-transparent text-sm">
            Reset
          </Button>
        </div>

        {liveResult && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="text-center space-y-3">
                <div>
                  <div className="text-2xl font-bold text-primary">{liveResult.gpa.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Semester GPA</div>
                </div>
                <div className="flex justify-center gap-3">
                  <Badge variant="secondary" className="text-xs">Grade: {getGradeFromGPA(liveResult.gpa)}</Badge>
                  <Badge variant="outline" className="text-xs">Total Credits: {liveResult.totalCredits}</Badge>
                  {studyTime > 0 && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {studyTime} min
                    </Badge>
                  )}
                </div>
                
                {/* Motivational badges based on GPA */}
                <div className="flex justify-center gap-2 mt-2">
                  {liveResult.gpa >= 3.5 && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      <Trophy className="h-3 w-3 mr-1" />
                      Excellent
                    </Badge>
                  )}
                  {liveResult.gpa >= 3.0 && liveResult.gpa < 3.5 && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      Good
                    </Badge>
                  )}
                  {liveResult.gpa >= 2.0 && liveResult.gpa < 3.0 && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <Flame className="h-3 w-3 mr-1" />
                      Keep Going
                    </Badge>
                  )}
                  {liveResult.gpa < 2.0 && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      Improvement
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}