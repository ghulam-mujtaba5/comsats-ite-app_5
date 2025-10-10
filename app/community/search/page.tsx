"use client"

import { useState } from "react"
import Link from "next/link"
import { useCampus } from "@/contexts/campus-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Hash,
  Clock,
  Heart,
  MessageCircle,
  Users,
  TrendingUp,
  SlidersHorizontal,
  X,
  AlertCircle,
  Star
} from "lucide-react"
import { useAdvancedSearch } from "@/hooks/use-advanced-search"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"

export default function CommunitySearchPage() {
  const { filters, results, loading, error, updateFilters, clearFilters } = useAdvancedSearch()
  const { selectedCampus, selectedDepartment, departments } = useCampus()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({})
  const [showFilters, setShowFilters] = useState(false)

  // Initialize with campus and department if available
  useState(() => {
    if (selectedCampus?.id) {
      updateFilters({ campusId: selectedCampus.id })
    }
    if (selectedDepartment?.id) {
      updateFilters({ departmentId: selectedDepartment.id })
    }
  })

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    )
  }

  const applyFilters = () => {
    updateFilters({
      tags: selectedTags,
      dateRange
    })
    setShowFilters(false)
  }

  const popularTags = [
    "Final Year Project",
    "Study Group",
    "Internship",
    "Career",
    "Programming",
    "Mathematics",
    "Physics",
    "Business",
    "AI",
    "Machine Learning",
    "Scholarship",
    "Research",
    "Hackathon",
    "Club",
    "Event"
  ]

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "study", label: "Study" },
    { value: "achievement", label: "Achievement" },
    { value: "opportunity", label: "Opportunity" },
    { value: "general", label: "General" },
    { value: "question", label: "Question" }
  ]

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "liked", label: "Most Liked" },
    { value: "commented", label: "Most Commented" }
  ]

  const postTypes = [
    { value: "general", label: "General Discussion" },
    { value: "study", label: "Study Related" },
    { value: "achievement", label: "Achievement" },
    { value: "opportunity", label: "Opportunity" },
    { value: "question", label: "Question" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="app-container section py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-blue-500/15 border border-primary/30 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <Search className="h-10 w-10" />
            <span>Advanced Search</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Find What You're <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Looking For</span>
          </h1>
          
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-10xl mx-auto mb-6">
            Search across posts, groups, events, and more with advanced filtering options.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3.5 h-10 w-10 text-gray-400" />
                <Input
                  placeholder="Search posts, tags, people..."
                  value={filters.query}
                  onChange={(e) => updateFilters({ query: e.target.value })}
                  className="pl-10 h-12 text-base"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-12"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-10 w-10" />
                  Filters
                </Button>
                
                <Button 
                  className="h-12 px-6"
                  onClick={() => updateFilters({ query: filters.query })}
                >
                  <Search className="h-10 w-10 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                {selectedTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    className="flex items-center gap-1 pl-2 pr-1 py-1"
                  >
                    <span>#{tag}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => handleTagToggle(tag)}
                    >
                      <X className="h-10 w-10" />
                    </Button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-2 text-xs"
                  onClick={() => setSelectedTags([])}
                >
                  Clear all
                </Button>
              </div>
            )}
            
            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Campus Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Campus
                    </label>
                    <Select 
                      value={filters.campusId || ""} 
                      onValueChange={(value) => updateFilters({ campusId: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select campus" />
                      </SelectTrigger>
                      <SelectContent>
                        {useCampus().campuses.map((campus: any) => (
                          <SelectItem key={campus.id} value={campus.id}>
                            {campus.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Department Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Department
                    </label>
                    <Select 
                      value={filters.departmentId || ""} 
                      onValueChange={(value) => updateFilters({ departmentId: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {useCampus().departments.map((department: any) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Category
                    </label>
                    <Select 
                      value={filters.category || "all"} 
                      onValueChange={(value) => updateFilters({ category: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Sort By */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Sort By
                    </label>
                    <Select 
                      value={filters.sortBy || "recent"} 
                      onValueChange={(value) => updateFilters({ sortBy: value as any })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Date Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Date Range
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="date"
                        placeholder="From"
                        value={dateRange.from || ""}
                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Input
                        type="date"
                        placeholder="To"
                        value={dateRange.to || ""}
                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Post Types */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Post Types
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {postTypes.map((type) => (
                      <div key={type.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`type-${type.value}`}
                          checked={filters.postTypes?.includes(type.value) || false}
                          onChange={(e) => {
                            const currentTypes = filters.postTypes || []
                            if (e.target.checked) {
                              updateFilters({ postTypes: [...currentTypes, type.value] })
                            } else {
                              updateFilters({ postTypes: currentTypes.filter(t => t !== type.value) })
                            }
                          }}
                          className="h-10 w-10 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label 
                          htmlFor={`type-${type.value}`} 
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedTags.includes(tag)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-primary/20"
                        )}
                        onClick={() => handleTagToggle(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Filter Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-6">
          {loading ? (
            <CenteredLoader message="Searching..." />
          ) : error ? (
            <Card className="p-8 text-center text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-medium text-lg">Search Error</h3>
              <p className="mb-4">{error}</p>
              <Button onClick={() => updateFilters({ query: filters.query })}>
                Try Again
              </Button>
            </Card>
          ) : results.length === 0 && filters.query ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <Search className="h-12 w-12 text-gray-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">No results found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            </Card>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Found {results.length} results
              </div>
              
              <div className="space-y-4">
                {results.map((result) => (
                  <Card 
                    key={result.id} 
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 hover:shadow-lg transition-all duration-300 rounded-2xl"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={result.authorAvatar} />
                          <AvatarFallback>
                            {result.author.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-10">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {result.author}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {result.type}
                            </Badge>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(result.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <Link href={`/community/post/${result.id}`} className="block">
                            <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                              {result.content}
                            </p>
                          </Link>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Heart className="h-10 w-10" />
                              <span>{result.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-10 w-10" />
                              <span>{result.comments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-10 w-10" />
                              <span>{result.campus}</span>
                            </div>
                            {result.batch && (
                              <div className="flex items-center gap-1">
                                <Users className="h-10 w-10" />
                                <span>{result.batch}</span>
                              </div>
                            )}
                          </div>
                          
                          {result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {result.tags.slice(0, 5).map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary" 
                                  className="text-xs py-0.5 px-2 cursor-pointer"
                                  onClick={() => {
                                    updateFilters({ query: tag })
                                  }}
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="p-8">
              <div className="text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Start searching to find content
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Enter a search term above to find posts, discussions, and community content.
                </p>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Popular search topics
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularTags.slice(0, 8).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() => updateFilters({ query: tag })}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}