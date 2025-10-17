"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  FileText, 
  Save, 
  X,
  Compass,
  HelpCircle,
  Activity,
  Sparkles,
  Eye,
  Filter,
  Settings,
  Calendar,
  Globe,
  Lock,
  Star,
  RefreshCw
} from "lucide-react"
import styles from "@/app/admin/admin-shared.module.css"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { RichTextEditor } from "@/components/community/rich-text-editor"

interface GuideSection {
  id: string
  title: string
  description: string
  category: "academic" | "admission" | "campus" | "financial" | "policies"
  content: string
  is_important: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

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

export default function AdminGuidancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [guideSections, setGuideSections] = useState<GuideSection[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGuide, setEditingGuide] = useState<GuideSection | null>(null)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [showGuideDialog, setShowGuideDialog] = useState(false)
  const [showFaqDialog, setShowFaqDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [contentResponse, faqResponse] = await Promise.all([
        fetch('/api/guidance/content'),
        fetch('/api/guidance/faq')
      ])

      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setGuideSections(contentData)
      }

      if (faqResponse.ok) {
        const faqData = await faqResponse.json()
        setFaqs(faqData)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load guidance data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGuide = async () => {
    if (!editingGuide) return

    try {
      const method = editingGuide.id ? 'PUT' : 'POST'
      const url = editingGuide.id ? `/api/guidance/content/${editingGuide.id}` : '/api/guidance/content'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGuide)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Guide ${editingGuide.id ? 'updated' : 'created'} successfully`
        })
        setShowGuideDialog(false)
        setEditingGuide(null)
        fetchData()
      } else {
        throw new Error('Failed to save guide')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save guide",
        variant: "destructive"
      })
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
        toast({
          title: "Success",
          description: `FAQ ${editingFaq.id ? 'updated' : 'created'} successfully`
        })
        setShowFaqDialog(false)
        setEditingFaq(null)
        fetchData()
      } else {
        throw new Error('Failed to save FAQ')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save FAQ",
        variant: "destructive"
      })
    }
  }

  const handleDeleteGuide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guide?')) return

    try {
      const response = await fetch(`/api/guidance/content/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Guide deleted successfully"
        })
        fetchData()
      } else {
        throw new Error('Failed to delete guide')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete guide",
        variant: "destructive"
      })
    }
  }

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    try {
      const response = await fetch(`/api/guidance/faq/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "FAQ deleted successfully"
        })
        fetchData()
      } else {
        throw new Error('Failed to delete FAQ')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive"
      })
    }
  }

  const filteredGuideSections = guideSections.filter((section) => {
    const matchesSearch = section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || section.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const newGuide = (): GuideSection => ({
    id: '',
    title: '',
    description: '',
    category: 'academic',
    content: '',
    is_important: false,
    is_published: true,
    created_at: '',
    updated_at: ''
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
      {/* Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className={`relative ${styles.section} pt-12 pb-8`}>
          <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                    <div className="relative bg-gradient-to-r from-teal-600 to-cyan-600 p-3 rounded-2xl">
                      <Compass className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-800 dark:from-white dark:via-teal-200 dark:to-cyan-200 bg-clip-text text-transparent">
                      Guidance Management
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                      Manage comprehensive guidance content and FAQ for students
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-teal-200 dark:border-teal-800">
                    <Activity className="h-3 w-3 mr-1" />
                    {guideSections.length} Guides
                  </Badge>
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
                <Button size="sm" variant="outline" className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Site
                </Button>
                <Button size="sm" onClick={fetchData} className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Management Interface */}
      <div className={`${styles.section} ${styles.spaceY6} pb-12`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Content Management</h2>
            <p className="text-slate-600 dark:text-slate-300">Create and manage guidance content for students</p>
          </div>
          <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
            <BookOpen className="h-3 w-3 mr-1" />
            Live Content
          </Badge>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
          
          <CardContent className="relative p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search guides and FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="admission">Admission</SelectItem>
                  <SelectItem value="campus">Campus</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="policies">Policies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList className="glass-card bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 grid w-full lg:w-auto grid-cols-2">
            <TabsTrigger value="guides" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
              <BookOpen className="h-4 w-4" />
              Guidance Sections
              <Badge variant="outline" className="text-xs ml-1">{guideSections.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
              <HelpCircle className="h-4 w-4" />
              FAQ Items
              <Badge variant="outline" className="text-xs ml-1">{faqs.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-6">
            <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-30" />
                      <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white">Guidance Sections</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-300">Manage comprehensive guidance content for students</CardDescription>
                    </div>
                  </div>
                  
                  <Dialog open={showGuideDialog} onOpenChange={(open) => {
                    setShowGuideDialog(open)
                    if (!open) {
                      setEditingGuide(null)
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingGuide(newGuide())} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Guide
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl glass-card border border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-emerald-600" />
                          {editingGuide?.id ? 'Edit Guide' : 'Create New Guide'}
                        </DialogTitle>
                        <DialogDescription>
                          Fill in the details for the guidance section
                        </DialogDescription>
                      </DialogHeader>
                      {editingGuide && (
                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</Label>
                            <Input
                              id="title"
                              value={editingGuide.title}
                              onChange={(e) => setEditingGuide({...editingGuide, title: e.target.value})}
                              placeholder="Guide title"
                              className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</Label>
                            <Input
                              id="description"
                              value={editingGuide.description}
                              onChange={(e) => setEditingGuide({...editingGuide, description: e.target.value})}
                              placeholder="Brief description"
                              className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                            />
                          </div>
                          <div>
                            <Label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</Label>
                            <Select value={editingGuide.category} onValueChange={(value: any) => setEditingGuide({...editingGuide, category: value})}>
                              <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="academic">Academic</SelectItem>
                                <SelectItem value="admission">Admission</SelectItem>
                                <SelectItem value="campus">Campus</SelectItem>
                                <SelectItem value="financial">Financial</SelectItem>
                                <SelectItem value="policies">Policies</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="content" className="text-sm font-medium text-slate-700 dark:text-slate-200">Content</Label>
                            <RichTextEditor
                              value={editingGuide.content}
                              onChange={(content) => setEditingGuide({...editingGuide, content})}
                              placeholder="Write your guide content here..."
                              className="min-h-[300px] glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                            />
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-slate-600/40 flex-1">
                              <div className="space-y-1">
                                <Label htmlFor="important" className="text-sm font-medium text-slate-700 dark:text-slate-200">Important</Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Mark this guide as important</p>
                              </div>
                              <Switch
                                id="important"
                                checked={editingGuide.is_important}
                                onCheckedChange={(checked) => setEditingGuide({...editingGuide, is_important: checked})}
                              />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-slate-600/40 flex-1">
                              <div className="space-y-1">
                                <Label htmlFor="published" className="text-sm font-medium text-slate-700 dark:text-slate-200">Published</Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Make this guide visible to students</p>
                              </div>
                              <Switch
                                id="published"
                                checked={editingGuide.is_published}
                                onCheckedChange={(checked) => setEditingGuide({...editingGuide, is_published: checked})}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setShowGuideDialog(false)
                          setEditingGuide(null)
                        }} className="glass-button">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleSaveGuide} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0">
                          <Save className="h-4 w-4 mr-2" />
                          Save Guide
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
            </Card>

          {loading ? (
            <div className="grid gap-4" aria-live="polite">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={`g-sk-${i}`} className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredGuideSections.length === 0 ? (
            <Card variant="soft" className="p-8 text-center">
              <div className="text-muted-foreground">No guidance sections found</div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredGuideSections.map((section) => (
                <Card key={section.id} variant="elevated" className="transition-shadow hover:shadow-lg interactive hover-lift slide-up">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          {section.is_important && (
                            <Badge variant="destructive" className="text-xs">Important</Badge>
                          )}
                          {!section.is_published && (
                            <Badge variant="secondary" className="text-xs">Draft</Badge>
                          )}
                        </div>
                        <CardDescription className="mt-1">{section.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingGuide(section)
                            setShowGuideDialog(true)
                          }}
                          aria-label={`Edit guide ${section.title}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteGuide(section.id)}
                          aria-label={`Delete guide ${section.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{section.category}</Badge>
                    <p className="text-sm text-gray-500 mt-2">
                      Last updated: {new Date(section.updated_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="faqs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">FAQ Items</h2>
            <Dialog open={showFaqDialog} onOpenChange={(open) => {
              setShowFaqDialog(open)
              if (!open) {
                setEditingFaq(null)
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingFaq(newFaq())}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingFaq?.id ? 'Edit FAQ' : 'Create New FAQ'}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the FAQ details
                  </DialogDescription>
                </DialogHeader>
                {editingFaq && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="question">Question</Label>
                      <Input
                        id="question"
                        value={editingFaq.question}
                        onChange={(e) => setEditingFaq({...editingFaq, question: e.target.value})}
                        placeholder="FAQ question"
                      />
                    </div>
                    <div>
                      <Label htmlFor="answer">Answer</Label>
                      <RichTextEditor
                        value={editingFaq.answer}
                        onChange={(answer) => setEditingFaq({...editingFaq, answer})}
                        placeholder="Write your FAQ answer here..."
                        className="min-h-[200px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="faq-category">Category</Label>
                      <Select value={editingFaq.category} onValueChange={(value) => setEditingFaq({...editingFaq, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="admission">Admission</SelectItem>
                          <SelectItem value="campus">Campus</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="policies">Policies</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={editingFaq.tags.join(', ')}
                        onChange={(e) => setEditingFaq({...editingFaq, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="faq-published"
                        checked={editingFaq.is_published}
                        onCheckedChange={(checked) => setEditingFaq({...editingFaq, is_published: checked})}
                      />
                      <Label htmlFor="faq-published">Published</Label>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setShowFaqDialog(false)
                    setEditingFaq(null)
                  }}>
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
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-lg">{faq.question}</CardTitle>
                          {!faq.is_published && (
                            <Badge variant="secondary" className="text-xs">Draft</Badge>
                          )}
                        </div>
                        <CardDescription className="mt-1">{faq.answer}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingFaq(faq)
                            setShowFaqDialog(true)
                          }}
                          aria-label={`Edit FAQ ${faq.question}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteFaq(faq.id)}
                          aria-label={`Delete FAQ ${faq.question}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{faq.category}</Badge>
                      {faq.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Last updated: {new Date(faq.updated_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
