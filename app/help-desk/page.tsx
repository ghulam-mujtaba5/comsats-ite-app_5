"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { 
  Ticket, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  User, 
  Hash, 
  Send,
  ExternalLink,
  Plus,
  TicketCheck,
  Headphones,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HelpTicket {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  created_at: string
  help_desk_responses?: { count: number }[]
}

export default function HelpDeskPage() {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<HelpTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium",
    student_name: "",
    student_id: "",
  })

  const categories = [
    { value: "general", label: "General Support" },
    { value: "technical", label: "Technical Issues" },
    { value: "academic", label: "Academic Support" },
    { value: "account", label: "Account Issues" },
    { value: "billing", label: "Billing & Finance" }
  ]

  const priorities = [
    { value: "low", label: "Low Priority", color: "text-green-600", bg: "bg-green-50" },
    { value: "medium", label: "Medium Priority", color: "text-yellow-600", bg: "bg-yellow-50" },
    { value: "high", label: "High Priority", color: "text-red-600", bg: "bg-red-50" }
  ]

  const statusConfig = {
    open: { label: "Open", icon: AlertCircle, color: "text-blue-600", bg: "from-blue-500/20 to-indigo-500/20", border: "border-blue-200/30" },
    "in-progress": { label: "In Progress", icon: Clock, color: "text-yellow-600", bg: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-200/30" },
    resolved: { label: "Resolved", icon: CheckCircle, color: "text-green-600", bg: "from-green-500/20 to-emerald-500/20", border: "border-green-200/30" },
    closed: { label: "Closed", icon: TicketCheck, color: "text-gray-600", bg: "from-gray-500/20 to-slate-500/20", border: "border-gray-200/30" }
  }

  const grouped = useMemo(() => {
    const map: Record<string, HelpTicket[]> = { open: [], "in-progress": [], resolved: [], closed: [] }
    for (const t of tickets) {
      const k = (t.status as keyof typeof map) || "open"
      if (!map[k]) map[k] = []
      map[k].push(t)
    }
    return map
  }, [tickets])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/help-desk/tickets", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load tickets")
      setTickets(json.data || [])
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/help-desk/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to create ticket")
      toast({ title: "Ticket created successfully", description: "We'll get back to you soon!" })
      setForm({ title: "", description: "", category: "general", priority: "medium", student_name: "", student_id: "" })
      load()
    } catch (e: any) {
      toast({ title: "Error creating ticket", description: e.message, variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500/30 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <div className="container max-w-6xl py-24 space-y-10 relative z-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Support", href: "/support" }, { label: "Help Desk" }]} />
        
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
            <Headphones className="h-4 w-4" />
            Help Desk
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-[0.9] text-balance mb-6">
            Get{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Expert Help
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-serif max-w-4xl mx-auto mb-4">
            Submit a support ticket and get personalized assistance from our expert team. 
            Track your requests and get timely responses.
          </p>
          <p className="text-lg text-muted-foreground/80 font-light max-w-xl mx-auto">
            Professional support when you need it most
          </p>
        </div>

        {/* Enhanced Create Ticket Form */}
        <Card className="card-modern border-0 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl">
          <CardHeader className="p-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-foreground">Create Support Ticket</CardTitle>
                <CardDescription className="text-base text-muted-foreground font-serif mt-2">
                  Describe your issue and we'll get back to you as soon as possible
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form className="space-y-6" onSubmit={onSubmit}>
              {/* Enhanced Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="student_name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Full Name
                  </Label>
                  <Input 
                    id="student_name"
                    placeholder="Enter your full name" 
                    value={form.student_name} 
                    onChange={(e) => setForm({ ...form, student_name: e.target.value })} 
                    required 
                    className="input-modern h-12 rounded-xl text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="student_id" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    Student ID
                  </Label>
                  <Input 
                    id="student_id"
                    placeholder="Enter your student ID" 
                    value={form.student_id} 
                    onChange={(e) => setForm({ ...form, student_id: e.target.value })} 
                    required 
                    className="input-modern h-12 rounded-xl text-base"
                  />
                </div>
              </div>

              {/* Enhanced Title */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Ticket Title
                </Label>
                <Input 
                  id="title"
                  placeholder="Brief description of your issue" 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  required 
                  className="input-modern h-12 rounded-xl text-base"
                />
              </div>

              {/* Enhanced Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    Category
                  </Label>
                  <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                    <SelectTrigger className="input-modern h-12 rounded-xl text-base">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="card-modern border-0 backdrop-blur-sm rounded-2xl">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="rounded-xl">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    Priority
                  </Label>
                  <Select value={form.priority} onValueChange={(value) => setForm({ ...form, priority: value })}>
                    <SelectTrigger className="input-modern h-12 rounded-xl text-base">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="card-modern border-0 backdrop-blur-sm rounded-2xl">
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value} className="rounded-xl">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${priority.bg}`} />
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-semibold text-foreground">
                  Issue Description
                </Label>
                <Textarea 
                  id="description"
                  placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..." 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  required 
                  rows={6}
                  className="input-modern rounded-xl text-base resize-none"
                />
              </div>

              {/* Enhanced Submit Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-3 hover-lift text-base font-semibold"
                >
                  {submitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Ticket...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Send className="h-5 w-5" />
                      Submit Ticket
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Enhanced My Tickets Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-foreground">
              My{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Tickets
              </span>
            </h2>
            <p className="text-muted-foreground font-serif text-lg leading-relaxed">
              Track the status and progress of your support requests
            </p>
          </div>
          
          {loading ? (
            <Card className="card-modern border-0 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Loading your tickets...</p>
              </CardContent>
            </Card>
          ) : tickets.length === 0 ? (
            <Card className="card-modern border-0 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-12 text-center">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Ticket className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">No Tickets Yet</h3>
                <p className="text-muted-foreground font-serif leading-relaxed">
                  You haven't created any support tickets yet. Create one above to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-10">
              {Object.entries(grouped).map(([status, list]) => {
                const config = statusConfig[status as keyof typeof statusConfig]
                if (!list.length) return null
                
                const StatusIcon = config.icon
                return (
                  <div key={status}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${config.bg} border ${config.border}`}>
                        <StatusIcon className={`h-6 w-6 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {config.label} 
                          <span className="ml-2 text-lg text-muted-foreground">({list.length})</span>
                        </h3>
                        <p className="text-muted-foreground font-serif">
                          {status === 'open' && 'Waiting for our team to respond'}
                          {status === 'in-progress' && 'Our team is actively working on these'}
                          {status === 'resolved' && 'Issues that have been resolved'}
                          {status === 'closed' && 'Completed and closed tickets'}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {list.map((t) => {
                        const priorityConfig = priorities.find(p => p.value === t.priority)
                        return (
                          <Card key={t.id} className="card-modern border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group hover-lift">
                            <CardHeader className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                  {t.title}
                                </CardTitle>
                                <div className="flex flex-col items-end gap-2">
                                  <Badge 
                                    variant="secondary" 
                                    className={cn(
                                      "text-xs font-medium px-3 py-1 rounded-xl",
                                      priorityConfig?.bg,
                                      priorityConfig?.color
                                    )}
                                  >
                                    {priorityConfig?.label}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(t.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-3 font-serif leading-relaxed">
                                {t.description}
                              </p>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Filter className="h-3 w-3" />
                                    <span className="capitalize">{t.category}</span>
                                  </div>
                                  {t.help_desk_responses && t.help_desk_responses.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3" />
                                      <span>{t.help_desk_responses[0].count} responses</span>
                                    </div>
                                  )}
                                </div>
                                <Link href={`/help-desk/${t.id}`}>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift rounded-xl"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-2" />
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
