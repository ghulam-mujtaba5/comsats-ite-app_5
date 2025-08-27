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
import { Search, Plus, Edit, Trash2, BookOpen, FileText, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
    <div className="app-container section">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Guidance Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage guidance content and FAQ items for students
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search guides and FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
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

      <Tabs defaultValue="guides" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guides">Guidance Sections</TabsTrigger>
          <TabsTrigger value="faqs">FAQ Items</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Guidance Sections</h2>
            <Dialog open={showGuideDialog} onOpenChange={(open) => {
              setShowGuideDialog(open)
              if (!open) {
                setEditingGuide(null)
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingGuide(newGuide())}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingGuide?.id ? 'Edit Guide' : 'Create New Guide'}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details for the guidance section
                  </DialogDescription>
                </DialogHeader>
                {editingGuide && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={editingGuide.title}
                        onChange={(e) => setEditingGuide({...editingGuide, title: e.target.value})}
                        placeholder="Guide title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={editingGuide.description}
                        onChange={(e) => setEditingGuide({...editingGuide, description: e.target.value})}
                        placeholder="Brief description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={editingGuide.category} onValueChange={(value: any) => setEditingGuide({...editingGuide, category: value})}>
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
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={editingGuide.content}
                        onChange={(e) => setEditingGuide({...editingGuide, content: e.target.value})}
                        placeholder="Guide content (supports markdown)"
                        rows={8}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="important"
                          checked={editingGuide.is_important}
                          onCheckedChange={(checked) => setEditingGuide({...editingGuide, is_important: checked})}
                        />
                        <Label htmlFor="important">Mark as Important</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="published"
                          checked={editingGuide.is_published}
                          onCheckedChange={(checked) => setEditingGuide({...editingGuide, is_published: checked})}
                        />
                        <Label htmlFor="published">Published</Label>
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setShowGuideDialog(false)
                    setEditingGuide(null)
                  }}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveGuide}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Guide
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading guidance sections...</div>
          ) : filteredGuideSections.length === 0 ? (
            <Card variant="soft" className="p-8 text-center">
              <div className="text-muted-foreground">No guidance sections found</div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredGuideSections.map((section) => (
                <Card key={section.id} variant="elevated">
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
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteGuide(section.id)}
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
                      <Textarea
                        id="answer"
                        value={editingFaq.answer}
                        onChange={(e) => setEditingFaq({...editingFaq, answer: e.target.value})}
                        placeholder="FAQ answer"
                        rows={4}
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
            <div className="text-center py-8">Loading FAQ items...</div>
          ) : filteredFaqs.length === 0 ? (
            <Card variant="soft" className="p-8 text-center">
              <div className="text-muted-foreground">No FAQs found</div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredFaqs.map((faq) => (
                <Card key={faq.id} variant="elevated">
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
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteFaq(faq.id)}
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
  )
}
