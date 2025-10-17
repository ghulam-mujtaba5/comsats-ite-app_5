"use client"

import { jsonLdBreadcrumb } from "@/lib/seo"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { notify, notifyFetch } from "@/lib/notify"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import layout from "@/app/styles/common.module.css"
import "./report-issue.light.module.css"
import "./report-issue.dark.module.css"
 

const categories = [
  { value: "General", label: "General" },
  { value: "Bug", label: "Bug" },
  { value: "Suggestion", label: "Suggestion" },
  { value: "UI", label: "UI" },
  { value: "Performance", label: "Performance" },
]

export default function ReportIssuePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("General")
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      notify.error("Incomplete", "Please provide a title and description.")
      return
    }
    setSubmitting(true)
    try {
      const res = await notifyFetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), category, email: email.trim() || undefined }),
      }, { errorMessage: "Failed to submit issue", successMessage: "Issue submitted", showOnSuccess: true })
      if (res.ok) {
        setTitle("")
        setDescription("")
        setEmail("")
        setCategory("General")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className={`px-4 py-10 flex-1`}>
        <div className={`${layout.section} ${layout.max3xl}`}>
        <h1 className="text-3xl font-bold mb-6">Report an Issue or Suggestion</h1>
        <Card>
          <CardHeader>
            <CardTitle>Help us improve CampusAxis</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Short summary" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" placeholder="Describe the issue or suggestion in detail" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-xs text-muted-foreground">(for updates)</span>
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="border-blue-200 focus:border-blue-400 dark:border-blue-800 dark:focus:border-blue-600"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    📧 Provide your email to receive updates on your issue
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Support", path: "/support" }, { name: "Report an Issue", path: "/report-issue" }])) }}
      />
    </div>
  )
}
