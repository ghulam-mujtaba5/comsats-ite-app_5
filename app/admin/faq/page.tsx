"use client"

import { useState, useEffect } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Save, X, HelpCircle, Sparkles, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import styles from "@/app/admin/admin-shared.module.css"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export default function AdminFaqPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [showFaqDialog, setShowFaqDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/guidance/faq')
      if (res.ok) {
        const data = await res.json()
        setFaqs(data)
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load FAQs", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveFaq = async () => {
    if (!editingFaq) return
    try {
      const method = editingFaq.id ? 'PUT' : 'POST'
      const url = editingFaq.id ? `/api/guidance/faq/${editingFaq.id}` : '/api/guidance/faq'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq)
      })
      if (response.ok) {
        toast({ title: "Success", description: `FAQ ${editingFaq.id ? 'updated' : 'created'} successfully` })
        setShowFaqDialog(false)
        setEditingFaq(null)
        fetchFaqs()
      } else {
        throw new Error('Failed to save FAQ')
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save FAQ", variant: "destructive" })
    }
  }

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    try {
      const response = await fetch(`/api/guidance/faq/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: "Success", description: "FAQ deleted successfully" })
        fetchFaqs()
      } else {
        throw new Error('Failed to delete FAQ')
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete FAQ", variant: "destructive" })
    }
  }

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const newFaq = (): FAQ => ({
    id: '',
    question: '',
    answer: '',
    category: 'academic',
    tags: [],
    is_published: true,
    created_at: '',
    updated_at: ''
  })

  return (
    <AdminGuard fallback={<div className="p-6 text-center">Admin access required. <a className="underline" href="/admin/login">Login</a></div>}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl" />
          <div className={`relative ${styles.section} pt-12 pb-8`}>
            <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-r from-teal-600 to-cyan-600 p-3 rounded-2xl">
                        <HelpCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-800 dark:from-white dark:via-teal-200 dark:to-cyan-200 bg-clip-text text-transparent">
                        FAQ Management
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Create, edit, and manage frequently asked questions for students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-cyan-200 dark:border-cyan-800">
                      <HelpCircle className="h-3 w-3 mr-1" />
                      {faqs.length} FAQs
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-blue-200 dark:border-blue-800">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Content System
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button size="sm" onClick={fetchFaqs} className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Filter className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.section} ${styles.spaceY6} pb-12 max-w-6xl mx-auto`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">FAQ Items</h2>
            <Dialog open={showFaqDialog} onOpenChange={(open) => {
              setShowFaqDialog(open)
              if (!open) setEditingFaq(null)
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingFaq(newFaq())}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingFaq?.id ? 'Edit FAQ' : 'Create New FAQ'}</DialogTitle>
                  <DialogDescription>Fill in the FAQ details</DialogDescription>
                </DialogHeader>
                {editingFaq && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="question">Question</Label>
                      <Input id="question" value={editingFaq.question} onChange={(e) => setEditingFaq({...editingFaq, question: e.target.value})} placeholder="FAQ question" />
                    </div>
                    <div>
                      <Label htmlFor="answer">Answer</Label>
                      <Textarea id="answer" value={editingFaq.answer} onChange={(e) => setEditingFaq({...editingFaq, answer: e.target.value})} placeholder="FAQ answer" rows={4} />
                    </div>
                    <div>
                      <Label htmlFor="faq-category">Category</Label>
                      <Input id="faq-category" value={editingFaq.category} onChange={(e) => setEditingFaq({...editingFaq, category: e.target.value})} placeholder="Category" />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input id="tags" value={editingFaq.tags.join(', ')} onChange={(e) => setEditingFaq({...editingFaq, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})} placeholder="tag1, tag2, tag3" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="faq-published" checked={editingFaq.is_published} onCheckedChange={(checked) => setEditingFaq({...editingFaq, is_published: checked})} />
                      <Label htmlFor="faq-published">Published</Label>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setShowFaqDialog(false); setEditingFaq(null) }}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveFaq}>
                    <Save className="h-4 w-4 mr-2" />
                    Save FAQ
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {loading ? (
            <div className="grid gap-4" aria-live="polite">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={`f-sk-${i}`} className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-56" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredFaqs.length === 0 ? (
            <Card variant="soft" className="p-8 text-center">
              <div className="text-muted-foreground">No FAQs found</div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredFaqs.map((faq) => (
                <Card key={faq.id} variant="elevated" className="transition-shadow hover:shadow-lg interactive hover-lift slide-up">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-lg">{faq.question}</CardTitle>
                          {!faq.is_published && (
                            <Badge variant="secondary" className="text-xs">Draft</Badge>
                          )}
                        </div>
                        <CardDescription className="mt-1">{faq.answer}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingFaq(faq); setShowFaqDialog(true) }} aria-label={`Edit FAQ ${faq.question}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteFaq(faq.id)} aria-label={`Delete FAQ ${faq.question}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{faq.category}</Badge>
                      {faq.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Last updated: {faq.updated_at ? new Date(faq.updated_at).toLocaleDateString() : ""}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}