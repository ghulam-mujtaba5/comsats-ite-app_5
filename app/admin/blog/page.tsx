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
  Eye,
  Filter,
  Calendar,
  Globe,
  Lock,
  Star,
  RefreshCw,
  Tag,
  Image,
  Link as LinkIcon,
  Eye as PreviewIcon
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useCampus } from "@/contexts/campus-context"
import { marked } from 'marked'
import { RichTextEditor } from "@/components/community/rich-text-editor"

interface BlogArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featured_image_url: string | null
  is_published: boolean
  is_featured: boolean
  campus_id: string | null
  department_id: string | null
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export default function AdminBlogPage() {
  const { campuses, departments } = useCampus()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null)
  const [showArticleDialog, setShowArticleDialog] = useState(false)
  const [newTag, setNewTag] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/blog')
      
      if (response.ok) {
        const data = await response.json()
        setArticles(data.data || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog articles",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveArticle = async () => {
    if (!editingArticle) return

    try {
      const method = editingArticle.id ? 'PUT' : 'POST'
      const url = editingArticle.id ? `/api/blog/${editingArticle.id}` : '/api/blog'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArticle)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Article ${editingArticle.id ? 'updated' : 'created'} successfully`
        })
        setShowArticleDialog(false)
        setEditingArticle(null)
        fetchData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save article')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save article",
        variant: "destructive"
      })
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Article deleted successfully"
        })
        fetchData()
      } else {
        throw new Error('Failed to delete article')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive"
      })
    }
  }

  const handleCreateNew = () => {
    setEditingArticle({
      id: "",
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "academic",
      tags: [],
      featured_image_url: null,
      is_published: false,
      is_featured: false,
      campus_id: null,
      department_id: null,
      view_count: 0,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    setShowArticleDialog(true)
  }

  const handleEdit = (article: BlogArticle) => {
    setEditingArticle({ ...article })
    setShowArticleDialog(true)
  }

  const addTag = () => {
    if (editingArticle && newTag.trim() && !editingArticle.tags.includes(newTag.trim())) {
      setEditingArticle({
        ...editingArticle,
        tags: [...editingArticle.tags, newTag.trim()]
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (editingArticle) {
      setEditingArticle({
        ...editingArticle,
        tags: editingArticle.tags.filter(tag => tag !== tagToRemove)
      })
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "campus-life":
        return "bg-green-100 text-green-800 border-green-200"
      case "career":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "technology":
        return "bg-red-100 text-red-800 border-red-200"
      case "research":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "events":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, edit, and manage blog articles and posts
          </p>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="campus-life">Campus Life</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="events">Events</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchData} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>
        </div>

        {/* Articles List */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Articles</CardTitle>
            <CardDescription>
              Manage all blog articles and posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No articles found matching your criteria.</p>
                <Button onClick={handleCreateNew} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Article
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{article.title}</h3>
                            {article.is_featured && (
                              <Badge variant="destructive" className="text-xs">
                                Featured
                              </Badge>
                            )}
                            <Badge className={getCategoryColor(article.category)}>
                              {article.category.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right text-xs text-gray-500 mr-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{article.view_count} views</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {article.published_at 
                                  ? new Date(article.published_at).toLocaleDateString()
                                  : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(article)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteArticle(article.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Article Editor Dialog */}
        <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle?.id ? "Edit Article" : "Create New Article"}
              </DialogTitle>
              <DialogDescription>
                {editingArticle?.id 
                  ? "Edit the details of your blog article" 
                  : "Create a new blog article for your students"}
              </DialogDescription>
            </DialogHeader>
            
            {editingArticle && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editingArticle.title}
                      onChange={(e) => setEditingArticle({
                        ...editingArticle,
                        title: e.target.value,
                        slug: generateSlug(e.target.value)
                      })}
                      placeholder="Enter article title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={editingArticle.slug}
                      onChange={(e) => setEditingArticle({
                        ...editingArticle,
                        slug: e.target.value
                      })}
                      placeholder="article-url-slug"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={editingArticle.excerpt}
                    onChange={(e) => setEditingArticle({
                      ...editingArticle,
                      excerpt: e.target.value
                    })}
                    placeholder="Brief summary of the article"
                    rows={3}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="content">Content</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (editingArticle) {
                          const previewWindow = window.open('', '_blank')
                          previewWindow?.document.write(`
                            <html>
                              <head>
                                <title>Preview</title>
                                <style>
                                  body { font-family: sans-serif; padding: 20px; }
                                  h1, h2, h3 { color: #333; }
                                  p { line-height: 1.6; }
                                </style>
                              </head>
                              <body>
                                <div>${marked(editingArticle.content || '')}</div>
                              </body>
                            </html>
                          `)
                          previewWindow?.document.close()
                        }
                      }}
                    >
                      <PreviewIcon className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  <RichTextEditor
                    value={editingArticle.content}
                    onChange={(content) => setEditingArticle({
                      ...editingArticle,
                      content
                    })}
                    placeholder="Write your article content here..."
                    className="min-h-[300px]"
                  />
                  <p className="text-sm text-gray-500 mt-1">You can use Markdown syntax for formatting</p>
                </div>

                {/* Category and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={editingArticle.category} 
                      onValueChange={(value) => setEditingArticle({
                        ...editingArticle,
                        category: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="campus-life">Campus Life</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                      />
                      <Button onClick={addTag} type="button">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editingArticle.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                          <button 
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div>
                  <Label htmlFor="featured_image_url">Featured Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="featured_image_url"
                      value={editingArticle.featured_image_url || ""}
                      onChange={(e) => setEditingArticle({
                        ...editingArticle,
                        featured_image_url: e.target.value || null
                      })}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button variant="outline" size="icon">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Campus and Department Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="campus">Campus Filter</Label>
                    <Select 
                      value={editingArticle.campus_id || ""} 
                      onValueChange={(value) => setEditingArticle({
                        ...editingArticle,
                        campus_id: value || null
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Campuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Campuses</SelectItem>
                        {campuses.map((campus) => (
                          <SelectItem key={campus.id} value={campus.id}>
                            {campus.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Department Filter</Label>
                    <Select 
                      value={editingArticle.department_id || ""} 
                      onValueChange={(value) => setEditingArticle({
                        ...editingArticle,
                        department_id: value || null
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Departments</SelectItem>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Status Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="is_published">Published</Label>
                      <p className="text-sm text-gray-500">Make article visible to students</p>
                    </div>
                    <Switch
                      id="is_published"
                      checked={editingArticle.is_published}
                      onCheckedChange={(checked) => setEditingArticle({
                        ...editingArticle,
                        is_published: checked,
                        published_at: checked ? (editingArticle.published_at || new Date().toISOString()) : null
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="is_featured">Featured</Label>
                      <p className="text-sm text-gray-500">Highlight on homepage</p>
                    </div>
                    <Switch
                      id="is_featured"
                      checked={editingArticle.is_featured}
                      onCheckedChange={(checked) => setEditingArticle({
                        ...editingArticle,
                        is_featured: checked
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Views</Label>
                      <p className="text-sm text-gray-500">{editingArticle.view_count} views</p>
                    </div>
                    <Eye className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowArticleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveArticle}>
                <Save className="h-4 w-4 mr-2" />
                Save Article
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}