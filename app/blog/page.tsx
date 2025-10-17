"use client"

import { useState, useEffect } from "react"
import { useCampus } from "@/contexts/campus-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import layout from "@/app/styles/common.module.css"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { Search, Calendar, Eye, User, Tag } from "lucide-react"
import Link from "next/link"
import { marked } from 'marked'

interface BlogArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author_name: string
  featured_image_url: string | null
  is_featured: boolean
  view_count: number
  published_at: string
  created_at: string
  updated_at: string
}

export default function BlogPage() {
  const { selectedCampus, selectedDepartment } = useCampus()
  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [limit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [selectedCampus, selectedDepartment, searchQuery, selectedCategory])

  const fetchArticles = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('limit', limit.toString())
      params.set('offset', '0')
      
      if (searchQuery) params.set('search', searchQuery)
      if (selectedCategory !== "all") params.set('category', selectedCategory)
      if (selectedCampus?.id) params.set('campus_id', selectedCampus.id)
      if (selectedDepartment?.id) params.set('department_id', selectedDepartment.id)

      const res = await fetch(`/api/blog?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch articles')
      
      const data = await res.json()
      setArticles(data.data || [])
      setHasMore(data.data?.length === limit)
      setOffset(limit)
    } catch (err: any) {
      setError(err.message || "Failed to load articles")
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    try {
      const params = new URLSearchParams()
      params.set('limit', limit.toString())
      params.set('offset', offset.toString())
      
      if (searchQuery) params.set('search', searchQuery)
      if (selectedCategory !== "all") params.set('category', selectedCategory)
      if (selectedCampus?.id) params.set('campus_id', selectedCampus.id)
      if (selectedDepartment?.id) params.set('department_id', selectedDepartment.id)

      const res = await fetch(`/api/blog?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch articles')
      
      const data = await res.json()
      setArticles(prev => [...prev, ...(data.data || [])])
      setHasMore(data.data?.length === limit)
      setOffset(prev => prev + limit)
    } catch (err: any) {
      setError(err.message || "Failed to load more articles")
    }
  }

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

  const filteredArticles = articles.filter(article => {
    if (selectedCategory === "all") return true
    return article.category === selectedCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${layout.section} ${layout.max6xl} px-4 py-8`}>
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Campus Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Stay updated with the latest news, insights, and stories from the COMSATS community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "academic" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("academic")}
            >
              Academic
            </Button>
            <Button
              variant={selectedCategory === "campus-life" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("campus-life")}
            >
              Campus Life
            </Button>
            <Button
              variant={selectedCategory === "career" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("career")}
            >
              Career
            </Button>
            <Button
              variant={selectedCategory === "technology" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("technology")}
            >
              Technology
            </Button>
          </div>
        </div>

        {/* Featured Articles */}
        {articles.filter(a => a.is_featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.filter(a => a.is_featured).slice(0, 2).map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`} className="block">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {article.featured_image_url && (
                      <img 
                        src={article.featured_image_url} 
                        alt={article.title} 
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category.replace('-', ' ')}
                        </Badge>
                        {article.is_featured && (
                          <Badge variant="destructive" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <CardDescription>
                        <div 
                          dangerouslySetInnerHTML={{ __html: marked(article.excerpt || '') }} 
                        />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{article.author_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(article.published_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{article.view_count}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest Articles</h2>
          
          {loading ? (
            <CenteredLoader message="Loading articles..." />
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No articles found matching your criteria.</p>
              <Button onClick={fetchArticles} className="mt-4">Refresh</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredArticles
                .filter(a => !a.is_featured) // Exclude featured articles from this list
                .map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`} className="block">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category.replace('-', ' ')}
                        </Badge>
                        {article.is_featured && (
                          <Badge variant="destructive" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle>{article.title}</CardTitle>
                      <CardDescription>{article.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{article.author_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(article.published_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{article.view_count} views</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              
              {hasMore && (
                <div className="text-center pt-4">
                  <Button onClick={loadMore} variant="outline">
                    Load More
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}