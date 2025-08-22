"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MapPin, Calendar, User } from "lucide-react"

interface LostFoundItem {
  id: string
  title: string
  description: string
  category: "lost" | "found"
  type: string
  location: string
  date: string
  contactInfo: string
  status: "active" | "resolved"
  imageUrl?: string
}

const mockItems: LostFoundItem[] = [
  {
    id: "1",
    title: "Black iPhone 14",
    description: "Lost my black iPhone 14 near the library. Has a clear case with a blue sticker.",
    category: "lost",
    type: "Electronics",
    location: "Main Library",
    date: "2024-01-20",
    contactInfo: "ahmad.ali@student.comsats.edu.pk",
    status: "active",
  },
  {
    id: "2",
    title: "Red Water Bottle",
    description: "Found a red water bottle in the CS department. Has 'Sarah' written on it.",
    category: "found",
    type: "Personal Items",
    location: "CS Department",
    date: "2024-01-19",
    contactInfo: "fatima.khan@student.comsats.edu.pk",
    status: "active",
  },
  {
    id: "3",
    title: "Blue Backpack",
    description: "Lost my blue Adidas backpack containing textbooks and notebooks.",
    category: "lost",
    type: "Bags",
    location: "Cafeteria",
    date: "2024-01-18",
    contactInfo: "usman.malik@student.comsats.edu.pk",
    status: "resolved",
  },
]

export default function LostFoundPage() {
  const [items, setItems] = useState<LostFoundItem[]>(mockItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<"all" | "lost" | "found">("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "lost" as "lost" | "found",
    type: "",
    location: "",
    contactInfo: "",
  })

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    return matchesSearch && matchesCategory && item.status === "active"
  })

  const handleSubmit = () => {
    const item: LostFoundItem = {
      id: Date.now().toString(),
      ...newItem,
      date: new Date().toISOString().split('T')[0],
      status: "active",
    }
    setItems([item, ...items])
    setNewItem({
      title: "",
      description: "",
      category: "lost",
      type: "",
      location: "",
      contactInfo: "",
    })
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Lost & Found</h1>
          <p className="text-muted-foreground mt-2">
            Help your fellow students find their lost items or report found items
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Report Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Report Lost/Found Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value: "lost" | "found") =>
                    setNewItem({ ...newItem, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">Lost Item</SelectItem>
                    <SelectItem value="found">Found Item</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Item Title</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g., Black iPhone 14"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Item Type</Label>
                <Select
                  value={newItem.type}
                  onValueChange={(value) => setNewItem({ ...newItem, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Personal Items">Personal Items</SelectItem>
                    <SelectItem value="Bags">Bags</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="e.g., Main Library"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Provide detailed description..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Information</Label>
                <Input
                  id="contact"
                  value={newItem.contactInfo}
                  onChange={(e) => setNewItem({ ...newItem, contactInfo: e.target.value })}
                  placeholder="Your email or phone number"
                />
              </div>
            </div>
            <Button onClick={handleSubmit} className="w-full">
              Submit Report
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
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
        <Select
          value={filterCategory}
          onValueChange={(value: "all" | "lost" | "found") => setFilterCategory(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="lost">Lost Items</SelectItem>
            <SelectItem value="found">Found Items</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <Badge variant={item.category === "lost" ? "destructive" : "default"}>
                  {item.category === "lost" ? "Lost" : "Found"}
                </Badge>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                {item.type}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{item.description}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{item.contactInfo}</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Contact Owner
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found matching your search.</p>
        </div>
      )}
    </div>
  )
}
