"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Plus,
  MessageSquare,
  TrendingUp,
  Users,
  SlidersHorizontal,
  X
} from "lucide-react"
import { ThreadCard } from "@/components/community/thread-card"
import { PostCreationDialog } from "@/components/community/post-creation-dialog"
import { ResponsiveLayout, ResponsiveGrid } from "@/components/community/responsive-layout"
import { useIsMobile } from "@/hooks/use-mobile"

interface MobileCommunityViewProps {
  posts: any[]
  groups: any[]
  events: any[]
  loading: boolean
  error: string | null
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedBatch: string
  setSelectedBatch: (batch: string) => void
  availableBatches: string[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  viewMode: 'feed' | 'trending' | 'following'
  setViewMode: (mode: 'feed' | 'trending' | 'following') => void
  isCreatePostOpen: boolean
  setIsCreatePostOpen: (open: boolean) => void
  newPost: string
  setNewPost: (post: string) => void
  postType: string
  setPostType: (type: string) => void
  handleCreatePost: (content: any) => Promise<void>
  handleLike: (id: string) => void
  handleJoinGroup: (id: string) => void
  loadMorePosts: () => void
  hasMorePosts: boolean
  loadingMorePosts: boolean
}

export function MobileCommunityView({
  posts,
  groups,
  events,
  loading,
  error,
  selectedCategory,
  setSelectedCategory,
  selectedBatch,
  setSelectedBatch,
  availableBatches,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  isCreatePostOpen,
  setIsCreatePostOpen,
  newPost,
  setNewPost,
  postType,
  setPostType,
  handleCreatePost,
  handleLike,
  handleJoinGroup,
  loadMorePosts,
  hasMorePosts,
  loadingMorePosts
}: MobileCommunityViewProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <ResponsiveLayout className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Community</h1>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="min-h-[44px] min-w-[44px]">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-4 top-4 min-h-[44px] min-w-[44px]"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="study">Study</SelectItem>
                      <SelectItem value="opportunity">Opportunity</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Batch</label>
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All Batches</SelectItem>
                      {availableBatches.map(batch => (
                        <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="liked">Most Liked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="px-4 py-2">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="following">
              <Users className="h-4 w-4 mr-2" />
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <Tabs value={viewMode}>
          <TabsContent value="feed" className="mt-0 space-y-4">
            {posts.map((post) => (
              <ThreadCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={() => {}}
                onShare={() => {}}
              />
            ))}
            
            {hasMorePosts && (
              <div className="text-center">
                <Button
                  onClick={loadMorePosts}
                  disabled={loadingMorePosts}
                  variant="outline"
                  className="mx-auto min-h-[44px] px-6"
                >
                  {loadingMorePosts ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0">
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto text-slate-700 dark:text-slate-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Trending Content</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                See what's popular in the community right now
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="following" className="mt-0">
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-slate-700 dark:text-slate-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Following</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                See posts from people and groups you follow
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <Button 
          size="lg" 
          className="h-14 w-14 rounded-full shadow-lg min-h-[56px] min-w-[56px]"
          onClick={() => setIsCreatePostOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Post Creation Dialog */}
      <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>
          <PostCreationDialog
            open={isCreatePostOpen}
            onOpenChange={setIsCreatePostOpen}
            onCreatePost={async (content, type, tags, media) => {
              // Convert to the format expected by handleCreatePost
              const sharingContent = {
                description: content,
                type: type,
                tags: tags,
                media: media
              };
              await handleCreatePost(sharingContent);
            }}
          />
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  )
}
