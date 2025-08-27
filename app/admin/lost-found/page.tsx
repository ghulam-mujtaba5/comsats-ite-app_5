"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { toast } from "@/hooks/use-toast"

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
      <div className="app-container section">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Lost & Found Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage lost and found items reported by students
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="found">Found</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items Table */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Items ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-10 text-center text-muted-foreground" aria-live="polite">Loading…</div>
            ) : items.length === 0 ? (
              <Card variant="soft" className="p-8 text-center">
                <div className="text-muted-foreground">No items found.</div>
              </Card>
            ) : (
              <div className="overflow-auto" aria-busy={loading ? true : undefined}>
                <Table>
                  <caption className="sr-only">Lost and found items table</caption>
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">Title</TableHead>
                      <TableHead scope="col">Category</TableHead>
                      <TableHead scope="col">Type</TableHead>
                      <TableHead scope="col">Location</TableHead>
                      <TableHead scope="col">Status</TableHead>
                      <TableHead scope="col">Date</TableHead>
                      <TableHead scope="col">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant={item.category === "lost" ? "destructive" : "default"}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.item_type}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Badge variant={
                          item.status === "active" ? "default" :
                          item.status === "resolved" ? "secondary" : "outline"
                        }>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {item.status === "active" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemStatus(item.id, "resolved")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemStatus(item.id, "closed")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Item Detail Dialog */}
        {selectedItem && (
          <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedItem.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Category</p>
                    <Badge variant={selectedItem.category === "lost" ? "destructive" : "default"}>
                      {selectedItem.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">Status</p>
                    <Badge variant={
                      selectedItem.status === "active" ? "default" :
                      selectedItem.status === "resolved" ? "secondary" : "outline"
                    }>
                      {selectedItem.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">Type</p>
                    <p>{selectedItem.item_type}</p>
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{selectedItem.location}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Description</p>
                  <p className="text-sm">{selectedItem.description}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Contact Information</p>
                  <p className="text-sm">{selectedItem.contact_info}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>Created: {new Date(selectedItem.created_at).toLocaleString()}</p>
                  <p>Updated: {new Date(selectedItem.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminGuard>
  )
}
