"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Shield,
  MessageSquare,
  TrendingUp,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PostFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedBatch: string
  onBatchChange: (batch: string) => void
  availableBatches: string[]
  sortBy: string
  onSortChange: (sort: string) => void
  viewMode: 'feed' | 'trending' | 'following'
  onViewModeChange: (mode: 'feed' | 'trending' | 'following') => void
  isFilterOpen: boolean
  onFilterToggle: () => void
  activeFilters: {
    timeRange: string
    sortBy: string
    postTypes: string[]
  }
  onActiveFiltersChange: (filters: any) => void
  selectedTags: string[]
  onSelectedTagsChange: (tags: string[]) => void
  onResetFilters: () => void
  onApplyFilters: () => void
}

export function PostFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBatch,
  onBatchChange,
  availableBatches,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  isFilterOpen,
  onFilterToggle,
  activeFilters,
  onActiveFiltersChange,
  selectedTags,
  onSelectedTagsChange,
  onResetFilters,
  onApplyFilters
}: PostFiltersProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onSelectedTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onSelectedTagsChange([...selectedTags, tag])
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Filter Bar */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search and Main Filters */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search posts, tags, or people..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 h-12 text-base w-full"
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="opportunity">Opportunity</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Batch Filter */}
              <div>
                <Select value={selectedBatch} onValueChange={onBatchChange}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Batches</SelectItem>
                    {availableBatches.map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        {batch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Sorting and View Options */}
            <div className="flex flex-wrap gap-3">
              {/* Sort By */}
              <div>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="h-12 w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="liked">Most Liked</SelectItem>
                    <SelectItem value="commented">Most Commented</SelectItem>
                    <SelectItem value="shared">Most Shared</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* View Mode */}
              <div className="flex rounded-lg border border-border overflow-hidden">
                <Button
                  variant={viewMode === 'feed' ? "default" : "outline"}
                  size="sm"
                  className="rounded-none border-0"
                  onClick={() => onViewModeChange('feed')}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'trending' ? "default" : "outline"}
                  size="sm"
                  className="rounded-none border-0 border-l"
                  onClick={() => onViewModeChange('trending')}
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'following' ? "default" : "outline"}
                  size="sm"
                  className="rounded-none border-0 border-l"
                  onClick={() => onViewModeChange('following')}
                >
                  <Users className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Advanced Filter Button */}
              <Button
                variant="outline"
                className="flex items-center gap-2 h-12"
                onClick={onFilterToggle}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
          
          {/* Advanced Filters Panel */}
          {isFilterOpen && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Time Range Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Time Range
                  </label>
                  <Select 
                    value={activeFilters.timeRange} 
                    onValueChange={(value) => onActiveFiltersChange({...activeFilters, timeRange: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                      <SelectItem value="year">This year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Post Types Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Post Types
                  </label>
                  <div className="space-y-2">
                    {['general', 'study', 'achievement', 'opportunity', 'question'].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`type-${type}`}
                          checked={activeFilters.postTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onActiveFiltersChange({
                                ...activeFilters,
                                postTypes: [...activeFilters.postTypes, type]
                              })
                            } else {
                              onActiveFiltersChange({
                                ...activeFilters,
                                postTypes: activeFilters.postTypes.filter(t => t !== type)
                              })
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tags Filter */}
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
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
                    ].map((tag) => (
                      <Badge
                        key={tag}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedTags.includes(tag)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-primary/20"
                        )}
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <Button variant="outline" onClick={onResetFilters}>
                  Reset Filters
                </Button>
                <Button onClick={onApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}