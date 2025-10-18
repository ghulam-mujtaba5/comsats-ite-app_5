"use client"

import { useState, useEffect } from "react"
import { useCampus } from "@/contexts/campus-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MapPin, Calendar, User, Loader2, Image as ImageIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import layout from "@/app/styles/common.module.css"
import { cn } from "@/lib/utils"
import "./lost-found.light.module.css"
import "./lost-found.dark.module.css"

interface LostFoundItem {
  id: string
  title: string
  description: string
  category: "lost" | "found"
  item_type: string
  location: string
  contact_info: string
  status: "active" | "resolved" | "closed"
  image_url?: string
  created_at: string
  updated_at: string
  user_id: string
}

export default function LostFoundPage() {
  const { selectedCampus } = useCampus()
  const { user, isAuthenticated } = useAuth()
  const [items, setItems] = useState<LostFoundItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<"all" | "lost" | "found">("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "lost" as "lost" | "found",
    item_type: "",
    location: "",
    contact_info: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCampus?.id) params.append("campus_id", selectedCampus.id)
      if (filterCategory !== "all") params.append("category", filterCategory)
      if (searchQuery) params.append("search", searchQuery)
      
      const response = await fetch(`/api/lost-found?${params}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [filterCategory, searchQuery, selectedCampus])

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    return matchesSearch && matchesCategory && item.status === "active"
  })

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to report items.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', newItem.title)
      formData.append('description', newItem.description)
      formData.append('category', newItem.category)
      formData.append('item_type', newItem.item_type)
      formData.append('location', newItem.location)
      formData.append('contact_info', newItem.contact_info)
      
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const response = await fetch("/api/lost-found", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item reported successfully!",
        })
        setNewItem({
          title: "",
          description: "",
          category: "lost",
          item_type: "",
          location: "",
          contact_info: "",
        })
        setSelectedImage(null)
        setImagePreview(null)
        setIsDialogOpen(false)
        fetchItems()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to report item",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const cardDelayClasses = [
    "",
    "animate-delay-100",
    "animate-delay-200",
    "animate-delay-300",
    "animate-delay-400",
    "animate-delay-500",
    "animate-delay-700",
    "animate-delay-1000",
    "animate-delay-1500",
  ]

  const getCardDelayClass = (idx: number) => cardDelayClasses[Math.min(idx, cardDelayClasses.length - 1)]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-full blur-3xl animate-pulse" />
  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse animate-delay-2000" />
      </div>

      <div className={`relative px-4 py-12 ${layout.section} ${layout.max6xl}`}>
        {/* Enhanced Header Section */}
        <div className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-3xl p-8 mb-12 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
                  <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-2xl">
                    <Search className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-orange-800 to-amber-800 dark:from-white dark:via-orange-200 dark:to-amber-200 bg-clip-text text-transparent">
                    Lost & Found
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 font-medium">
                    Help your fellow students find their lost items or report found items to reunite them with their owners.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-orange-200 dark:border-orange-800">
                  <MapPin className="h-3 w-3 mr-1" />
                  Campus Community
                </Badge>
                <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-green-200 dark:border-green-800">
                  <User className="h-3 w-3 mr-1" />
                  Active {filteredItems.length} Items
                </Badge>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Report Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg blur opacity-30" />
                      <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    Report Lost/Found Item
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-3">
                    <Label htmlFor="category" className="font-semibold text-slate-700 dark:text-slate-200">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value: "lost" | "found") =>
                        setNewItem({ ...newItem, category: value })
                      }
                    >
                      <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lost">🔴 Lost Item</SelectItem>
                        <SelectItem value="found">🟢 Found Item</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="title" className="font-semibold text-slate-700 dark:text-slate-200">Item Title</Label>
                    <Input
                      id="title"
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      placeholder="e.g., Black iPhone 14, Blue Backpack, etc."
                      className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40"
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="item_type" className="font-semibold text-slate-700 dark:text-slate-200">Item Type</Label>
                    <Select
                      value={newItem.item_type}
                      onValueChange={(value) => setNewItem({ ...newItem, item_type: value })}
                    >
                      <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">📱 Electronics</SelectItem>
                        <SelectItem value="Personal Items">🎒 Personal Items</SelectItem>
                        <SelectItem value="Bags">👜 Bags</SelectItem>
                        <SelectItem value="Books">📚 Books</SelectItem>
                        <SelectItem value="Clothing">👕 Clothing</SelectItem>
                        <SelectItem value="Other">📦 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="location" className="font-semibold text-slate-700 dark:text-slate-200">Location</Label>
                    <Input
                      id="location"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      placeholder="e.g., Main Library, CS Department, Cafeteria"
                      className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40"
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="description" className="font-semibold text-slate-700 dark:text-slate-200">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Provide detailed description including color, size, brand, distinguishing features..."
                      rows={4}
                      className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40"
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="contact" className="font-semibold text-slate-700 dark:text-slate-200">Contact Information</Label>
                    <Input
                      id="contact"
                      value={newItem.contact_info}
                      onChange={(e) => setNewItem({ ...newItem, contact_info: e.target.value })}
                      placeholder="Your email or phone number for contact"
                      className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40"
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="image" className="font-semibold text-slate-700 dark:text-slate-200">
                      Item Photo (Optional)
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          onChange={handleImageChange}
                          className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40"
                        />
                        {selectedImage && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedImage(null)
                              setImagePreview(null)
                            }}
                            className="flex-shrink-0"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      {imagePreview && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        <ImageIcon className="inline h-3 w-3 mr-1" />
                        Accepted formats: JPG, PNG, WebP, GIF (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmit} 
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-lg" 
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-10 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search items by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40"
              />
            </div>
            <Select
              value={filterCategory}
              onValueChange={(value: "all" | "lost" | "found") => setFilterCategory(value)}
            >
              <SelectTrigger className="w-full md:w-48 glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="lost">🔴 Lost Items</SelectItem>
                <SelectItem value="found">🟢 Found Items</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Items Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                <span className="text-slate-600 dark:text-slate-300">Loading lost & found items...</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <Card
                key={item.id}
                className={cn(
                  "glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl overflow-hidden",
                  getCardDelayClass(index)
                )}
              >
                {item.image_url && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="relative">
                          <div className={`absolute inset-0 ${item.category === 'lost' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'} rounded-lg blur opacity-30`} />
                          <div className={`relative ${item.category === 'lost' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'} p-2 rounded-lg`}>
                            {item.category === 'lost' ? (
                              <Search className="h-4 w-4 text-white" />
                            ) : (
                              <MapPin className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            item.category === "lost" 
                              ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                              : 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                          }
                        >
                          {item.category === "lost" ? "🔴 Lost" : "🟢 Found"}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight">
                        {item.title}
                      </CardTitle>
                      
                      <CardDescription className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-2">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                          {item.item_type}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-30" />
                        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-1 rounded-full">
                          <MapPin className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <span className="font-medium">{item.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-30" />
                        <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-full">
                          <Calendar className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-30" />
                        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-1 rounded-full">
                          <User className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <span className="truncate">{item.contact_info}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 mt-4"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Contact Owner
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <Card className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
            <div className="space-y-4">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-xl opacity-30" />
                <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 p-5 rounded-3xl">
                  <Search className="h-10 w-10 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Items Found</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {searchQuery ? `No items match your search for "${searchQuery}".` : 'No lost or found items have been reported yet.'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Try adjusting your search or be the first to report an item!
                </p>
              </div>
            </div>
          </Card>
        )}     
      </div>
    </div>
  )
}
