"use client"

import { useState, useEffect } from "react"
import { useCampus } from "@/contexts/campus-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BrandedBanner } from "@/components/layout/branded-banner"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AdmissionsPage() {
  const { selectedCampus, campuses, departments } = useCampus()
  const [loading, setLoading] = useState(true)
  const [programs, setPrograms] = useState<any[]>([])
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cnic: "",
    fatherName: "",
    matricMarks: "",
    interMarks: "",
    entryTestMarks: "",
    campus: selectedCampus?.id || "",
    department: "",
    program: "",
    message: ""
  })
  const [aggregate, setAggregate] = useState<number | null>(null)
  const router = useRouter()

  // Load programs when department changes
  useEffect(() => {
    const loadPrograms = async () => {
      if (formData.department) {
        try {
          const response = await fetch(`/api/programs?department_id=${formData.department}`)
          const data = await response.json()
          setPrograms(data)
        } catch (error) {
          console.error("Error loading programs:", error)
          setPrograms([])
        }
      } else {
        setPrograms([])
      }
    }

    loadPrograms()
  }, [formData.department])

  // Calculate aggregate when marks change
  useEffect(() => {
    if (formData.matricMarks && formData.interMarks && formData.entryTestMarks) {
      const matric = parseFloat(formData.matricMarks)
      const inter = parseFloat(formData.interMarks)
      const entryTest = parseFloat(formData.entryTestMarks)
      
      if (!isNaN(matric) && !isNaN(inter) && !isNaN(entryTest) &&
          matric >= 0 && matric <= 100 &&
          inter >= 0 && inter <= 100 &&
          entryTest >= 0 && entryTest <= 100) {
        const calculatedAggregate = (matric * 0.1) + (inter * 0.4) + (entryTest * 0.5)
        setAggregate(parseFloat(calculatedAggregate.toFixed(2)))
      } else {
        setAggregate(null)
      }
    } else {
      setAggregate(null)
    }
  }, [formData.matricMarks, formData.interMarks, formData.entryTestMarks])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Reset dependent fields
    if (name === "campus") {
      setFormData(prev => ({
        ...prev,
        department: "",
        program: ""
      }))
    } else if (name === "department") {
      setFormData(prev => ({
        ...prev,
        program: ""
      }))
    }
  }

  const validateForm = () => {
    const requiredFields = [
      'fullName', 'email', 'phone', 'cnic', 'fatherName', 
      'campus', 'department', 'program', 'matricMarks', 
      'interMarks', 'entryTestMarks'
    ]
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error("Missing required field", {
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`
        })
        return false
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address."
      })
      return false
    }
    
    // Validate marks
    const matric = parseFloat(formData.matricMarks)
    const inter = parseFloat(formData.interMarks)
    const entryTest = parseFloat(formData.entryTestMarks)
    
    if (isNaN(matric) || matric < 0 || matric > 100) {
      toast.error("Invalid marks", {
        description: "Matric marks must be between 0 and 100."
      })
      return false
    }
    
    if (isNaN(inter) || inter < 0 || inter > 100) {
      toast.error("Invalid marks", {
        description: "Intermediate marks must be between 0 and 100."
      })
      return false
    }
    
    if (isNaN(entryTest) || entryTest < 0 || entryTest > 100) {
      toast.error("Invalid marks", {
        description: "Entry test marks must be between 0 and 100."
      })
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setLoading(true)
      const response = await fetch("/api/admissions/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          matricMarks: parseFloat(formData.matricMarks),
          interMarks: parseFloat(formData.interMarks),
          entryTestMarks: parseFloat(formData.entryTestMarks)
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        toast.success("Application submitted", {
          description: "Your application has been submitted successfully!"
        })
        router.push("/admissions/success")
      } else {
        toast.error("Submission failed", {
          description: result.error || "Failed to submit application. Please try again."
        })
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Network error", {
        description: "Failed to submit application. Please check your connection and try again."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <BrandedBanner 
        title="COMSATS Admission Application"
        description="Apply for admission to COMSATS University"
        variant="gradient"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                Please fill in all required information to apply for admission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father&apos;s Name *</Label>
                    <Input
                      id="fatherName"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      placeholder="Enter your father's name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cnic">CNIC *</Label>
                    <Input
                      id="cnic"
                      name="cnic"
                      value={formData.cnic}
                      onChange={handleInputChange}
                      placeholder="Enter your CNIC"
                    />
                  </div>
                </div>
                
                {/* Academic Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="matricMarks">Matric Marks (%) *</Label>
                      <Input
                        id="matricMarks"
                        name="matricMarks"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.matricMarks}
                        onChange={handleInputChange}
                        placeholder="Enter percentage"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="interMarks">Intermediate Marks (%) *</Label>
                      <Input
                        id="interMarks"
                        name="interMarks"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.interMarks}
                        onChange={handleInputChange}
                        placeholder="Enter percentage"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="entryTestMarks">Entry Test Marks (%) *</Label>
                      <Input
                        id="entryTestMarks"
                        name="entryTestMarks"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.entryTestMarks}
                        onChange={handleInputChange}
                        placeholder="Enter percentage"
                      />
                    </div>
                  </div>
                  
                  {aggregate !== null && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Calculated Aggregate: <span className="text-lg font-bold">{aggregate}%</span>
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Formula: 10% Matric + 40% Intermediate + 50% Entry Test
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Program Selection */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Program Selection</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="campus">Campus *</Label>
                      <Select 
                        value={formData.campus} 
                        onValueChange={(value) => handleSelectChange("campus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select campus" />
                        </SelectTrigger>
                        <SelectContent>
                          {campuses.map((campus) => (
                            <SelectItem key={campus.id} value={campus.id}>
                              {campus.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select 
                        value={formData.department} 
                        onValueChange={(value) => handleSelectChange("department", value)}
                        disabled={!formData.campus}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments
                            .filter(dept => dept.campus_id === formData.campus)
                            .map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="program">Program *</Label>
                      <Select 
                        value={formData.program} 
                        onValueChange={(value) => handleSelectChange("program", value)}
                        disabled={!formData.department}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Any additional information you'd like to share"
                      rows={4}
                    />
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <Button 
                    type="submit" 
                    className="glass-button-primary"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
