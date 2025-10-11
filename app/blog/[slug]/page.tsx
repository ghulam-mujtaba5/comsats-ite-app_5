"use client"

import { useState, useEffect } from "react"
import { useCampus } from "@/contexts/campus-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { Calendar, Eye, User, Tag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { marked } from 'marked'
import { ShareButton } from "@/components/share/share-button"
import { SEOMeta } from "@/components/seo/seo-meta"

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

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { selectedCampus, selectedDepartment } = useCampus()
  const [article, setArticle] = useState<BlogArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArticle()
  }, [])

  const fetchArticle = async () => {
    setLoading(true)
    setError(null)
    try {
      const { slug } = await params
      const res = await fetch(`/api/blog/${slug}`)
      if (!res.ok) {
        if (res.status === 404) {
          notFound()
          return
        }
        throw new Error('Failed to fetch article')
      }
      
      const data = await res.json()
      setArticle(data)
    } catch (err: any) {
      setError(err.message || "Failed to load article")
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <CenteredLoader message="Loading article..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center py-8 text-destructive">
          <h1 className="text-2xl font-bold mb-4">Error Loading Article</h1>
          <p>{error}</p>
          <Button onClick={fetchArticle} className="mt-4">Try Again</Button>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p>The article you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-4">
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOMeta 
        title={article.title}
        description={article.excerpt}
        type="article"
        image={article.featured_image_url || undefined}
        article={{
          publishedTime: article.published_at,
          modifiedTime: article.updated_at,
          author: article.author_name,
          section: article.category,
          tags: article.tags
        }}
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge className={getCategoryColor(article.category)}>
              {article.category.replace('-', ' ')}
            </Badge>
            {article.is_featured && (
              <Badge variant="destructive" className="text-xs">
                Featured
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{article.author_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{new Date(article.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span>{article.view_count} views</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featured_image_url && (
          <div className="mb-8">
            <img 
              src={article.featured_image_url} 
              alt={article.title} 
              className="w-full rounded-lg object-cover max-h-96"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <div 
            dangerouslySetInnerHTML={{ __html: marked(article.content || '') }} 
          />
        </article>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Share Button */}
        <div className="mb-8 flex justify-center">
          <ShareButton
            contentId={article.id}
            contentType="blog"
            title={article.title}
            text={article.excerpt}
          />
        </div>

        {/* Related Articles Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Articles</h2>
          <Card>
            <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
              <p>Related articles will be shown here based on category and tags.</p>
              <p className="text-sm mt-2">This feature will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}