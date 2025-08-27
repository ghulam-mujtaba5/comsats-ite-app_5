"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Edit, Trash2, CheckCircle, XCircle, ArrowLeft, Filter, Sparkles, MapPin, Calendar, User } from "lucide-react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface LostFoundItem {
  id: string
  title: string
  description: string
  category: "lost" | "found"
  item_type: string
  location: string
  contact_info: string
  status: "active" | "resolved" | "closed"
  created_at: string
  updated_at: string
  user_id: string
}

export default function AdminLostFoundPage() {
  const [items, setItems] = useState<LostFoundItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null)

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (searchQuery) params.append("search", searchQuery)
      
      const response = await fetch(`/api/admin/lost-found?${params}`)
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
  }, [statusFilter, categoryFilter, searchQuery])

  const updateItemStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/lost-found/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item status updated successfully!",
        })
        fetchItems()
      } else {
        toast({
          title: "Error",
          description: "Failed to update item status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const response = await fetch(`/api/admin/lost-found/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item deleted successfully!",
        })
        fetchItems()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          
          <div className="relative app-container pt-12 pb-8">
            <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Link href="/admin" className="group">
                      <Button variant="outline" className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Admin
                      </Button>
                    </Link>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-2xl">
                        <Search className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                        Lost & Found Management
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg mt-1">
                        Manage lost and found items reported by students
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-800">
                      <MapPin className="h-3 w-3 mr-1" />
                      Item Tracking
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-green-200 dark:border-green-800">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Real-time Updates
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="app-container mb-8">
          <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">🟢 Active</SelectItem>
                  <SelectItem value="resolved">✅ Resolved</SelectItem>
                  <SelectItem value="closed">🔴 Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48 glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="lost">🔴 Lost Items</SelectItem>
                  <SelectItem value="found">🟢 Found Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="app-container space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                  <span className="text-slate-600 dark:text-slate-300">Loading items...</span>
                </div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
              <div className="space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-30" />
                  <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-2xl">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Items Found</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    No lost or found items match your current filters.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Lost & Found Items ({items.length})
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Manage lost and found items reported by the campus community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-slate-200 dark:border-slate-700">
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Title</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Category</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Type</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Location</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Status</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Date</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors" style={{ animationDelay: `${index * 50}ms` }}>
                          <TableCell className="font-medium text-slate-900 dark:text-white">{item.title}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                item.category === "lost" 
                                  ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                                  : 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                              }
                            >
                              {item.category === "lost" ? "🔴" : "🟢"} {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300">
                              {item.item_type}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                              <MapPin className="h-3 w-3" />
                              {item.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                item.status === "active" 
                                  ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                                  : item.status === "resolved" 
                                  ? 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                                  : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                              }
                            >
                              {item.status === "active" && "🟦"}
                              {item.status === "resolved" && "✅"}
                              {item.status === "closed" && "🔴"}
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedItem(item)}
                                className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/70 dark:hover:bg-slate-700/70"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              {item.status === "active" && (
                                <Button
                                  size="sm"
                                  onClick={() => updateItemStatus(item.id, "resolved")}
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => updateItemStatus(item.id, "closed")}
                                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 shadow-sm hover:shadow-md transition-all duration-300"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => deleteItem(item.id)}
                                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-300"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Item Detail Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="sm:max-w-[600px] glass-card border border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="h-5 w-5" />
                {selectedItem.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Category</p>
                  <Badge 
                    variant="outline" 
                    className={
                      selectedItem.category === "lost" 
                        ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                        : 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                    }
                  >
                    {selectedItem.category === "lost" ? "🔴" : "🟢"} {selectedItem.category}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Status</p>
                  <Badge 
                    variant="outline" 
                    className={
                      selectedItem.status === "active" 
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                        : selectedItem.status === "resolved" 
                        ? 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                        : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }
                  >
                    {selectedItem.status === "active" && "🟦"}
                    {selectedItem.status === "resolved" && "✅"}
                    {selectedItem.status === "closed" && "🔴"}
                    {selectedItem.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Type</p>
                  <p className="text-slate-600 dark:text-slate-300">{selectedItem.item_type}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Location</p>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <MapPin className="h-3 w-3" />
                    {selectedItem.location}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="font-semibold text-slate-700 dark:text-slate-200">Description</p>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedItem.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="font-semibold text-slate-700 dark:text-slate-200">Contact Information</p>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <User className="h-4 w-4" />
                    {selectedItem.contact_info}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Created: {new Date(selectedItem.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Updated: {new Date(selectedItem.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminGuard>
  )
}
