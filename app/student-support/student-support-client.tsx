"use client"
// Extracted client component logic from original page for SEO-friendly server metadata wrapper.
import { useState, useEffect, useRef } from 'react'
import { useCampus } from '@/contexts/campus-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AdvancedFilterBar } from '@/components/search/advanced-filter-bar'
import { standardFilters } from '@/lib/filter-data'
import { Heart, Phone, MessageCircle, BookOpen, Users, Shield, Clock, Mail, RotateCcw, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import layout from "@/app/styles/common.module.css"

interface SupportResource {
  id: string
  title: string
  description: string
  category: 'mental-health' | 'academic' | 'financial' | 'career' | 'personal' | 'technical'
  contactInfo: string
  availability: string
  isEmergency?: boolean
  priority?: 'high' | 'medium' | 'low'
  rating?: number
  tags?: string[]
  lastUpdated?: string
}

export default function StudentSupportClient() {
  const { selectedCampus } = useCampus()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false)
  const [currentSort, setCurrentSort] = useState('priority-desc')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [supportResources, setSupportResources] = useState<SupportResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [requestForm, setRequestForm] = useState({ name: '', email: '', category: '', message: '', isAnonymous: false })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true)
      setError(null)
      try {
        const campusParam = selectedCampus?.id ? `?campus_id=${selectedCampus.id}` : ''
        const response = await fetch(`/api/student-support/resources${campusParam}`)
        if (response.ok) {
          const data = await response.json()
            .catch(() => [])
          setSupportResources(Array.isArray(data) ? data : [])
        } else {
          throw new Error('Failed to fetch resources')
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load support resources')
        // Fallback static essentials
        setSupportResources([
          { id: '1', title: 'Counseling Services', description: 'Professional counseling for mental health, stress management, and personal issues.', category: 'mental-health', contactInfo: 'counseling@cuilahore.edu.pk | Ext: 2345', availability: 'Mon-Fri 9:00 AM - 5:00 PM' },
          { id: '2', title: 'Crisis Helpline', description: '24/7 emergency support for students in crisis situations.', category: 'mental-health', contactInfo: 'Crisis Hotline: 042-111-911-911', availability: '24/7 Available', isEmergency: true },
          { id: '3', title: 'Academic Tutoring', description: 'Free tutoring services for struggling students in various subjects.', category: 'academic', contactInfo: 'tutoring@cuilahore.edu.pk | Room A-105', availability: 'Mon-Fri 2:00 PM - 6:00 PM' },
          { id: '4', title: 'Financial Aid Office', description: 'Assistance with scholarships, grants, and financial planning.', category: 'financial', contactInfo: 'finaid@cuilahore.edu.pk | Room B-201', availability: 'Mon-Fri 9:00 AM - 4:00 PM' },
          { id: '5', title: 'Career Counseling', description: 'Career guidance, resume building, and job placement assistance.', category: 'career', contactInfo: 'careers@cuilahore.edu.pk | Room C-301', availability: 'Tue-Thu 10:00 AM - 3:00 PM' },
          { id: '6', title: 'Peer Support Groups', description: 'Student-led support groups for various challenges and interests.', category: 'personal', contactInfo: 'peersupport@cuilahore.edu.pk', availability: 'Various times - Check schedule' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [selectedCampus])

  const handleSubmitRequest = async () => {
    if (!requestForm.name.trim() || !requestForm.email.trim() || !requestForm.message.trim()) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' })
      return
    }
    setSubmitting(true)
    try {
      const response = await fetch('/api/student-support/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestForm) })
      if (response.ok) {
        toast({ title: 'Success', description: 'Support request submitted successfully. We will get back to you soon.' })
        setRequestForm({ name: '', email: '', category: '', message: '', isAnonymous: false })
        setShowRequestDialog(false)
        setTimeout(() => triggerRef.current?.focus(), 0)
      } else throw new Error('Failed to submit request')
    } catch {
      toast({ title: 'Error', description: 'Failed to submit request. Please try again.', variant: 'destructive' })
    } finally { setSubmitting(false) }
  }

  const filteredResources = supportResources
    .filter(r => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags?.some(tag => tag.toLowerCase().includes(q))
      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory
      const matchesPriority = selectedPriority === 'all' || r.priority === selectedPriority
      const matchesEmergency = !showEmergencyOnly || r.isEmergency
      return matchesSearch && matchesCategory && matchesPriority && matchesEmergency
    })
    .sort((a, b) => {
      let result = 0
      switch (currentSort) {
        case 'priority-desc': {
          const order = { high: 3, medium: 2, low: 1 }
          result = (order[b.priority || 'medium'] || 2) - (order[a.priority || 'medium'] || 2)
          break
        }
        case 'title-asc': result = a.title.localeCompare(b.title); break
        case 'category-asc': result = a.category.localeCompare(b.category); break
        case 'rating-desc': result = (b.rating || 0) - (a.rating || 0); break
        case 'updated-desc': result = new Date(b.lastUpdated || '').getTime() - new Date(a.lastUpdated || '').getTime(); break
        default: result = 0
      }
      return sortDirection === 'desc' ? -result : result
    })

  const emergencyResources = supportResources.filter(r => r.isEmergency)
  const regularResources = filteredResources.filter(r => !r.isEmergency)

  const contactToHref = (contact: string): { href?: string; text: string } => {
    const trimmed = contact.trim()
    const emailMatch = trimmed.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
    if (emailMatch) return { href: `mailto:${emailMatch[0]}`, text: trimmed }
    const phoneMatch = trimmed.match(/\+?[0-9][0-9\-\s()]{5,}/)
    if (phoneMatch && !trimmed.toLowerCase().includes('ext')) {
      const digits = phoneMatch[0].replace(/[^0-9+]/g, '')
      return { href: `tel:${digits}`, text: trimmed }
    }
    return { text: trimmed }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <div className={`${layout.section} px-4 py-10`}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-foreground mb-5">
            <Heart className="h-3.5 w-3.5" /> Student Wellbeing
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Student <span className="text-primary">Support</span></h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Get the help and support you need for your academic and personal well-being. We're here to help you succeed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10 max-w-6xl mx-auto">
          <Card className="border">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">{supportResources.length}</div>
                <div className="text-xs text-muted-foreground">Support Services</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">{emergencyResources.length}</div>
                <div className="text-xs text-muted-foreground">Emergency Resources</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">{supportResources.filter(r=>r.category==='mental-health').length}</div>
                <div className="text-xs text-muted-foreground">Mental Health</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">{supportResources.filter(r=>r.category==='academic').length}</div>
                <div className="text-xs text-muted-foreground">Academic Support</div>
              </div>
            </CardContent>
          </Card>
        </div>
        {emergencyResources.length>0 && (
          <div className="mb-8 max-w-6xl mx-auto" aria-live="polite" {...(loading ? ({ 'aria-busy': 'true' } as any) : {})}>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2" /> Emergency Support
            </h2>
            <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
              {emergencyResources.map(r => (
                <Card key={r.id} className="border border-destructive/30 bg-destructive/5">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center text-base">
                      <Phone className="h-3.5 w-3.5 mr-2" />{r.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-2 text-sm">{r.description}</p>
                    <p className="text-sm text-foreground font-medium">{r.contactInfo}</p>
                    <p className="text-xs text-muted-foreground mt-1">{r.availability}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        <AdvancedFilterBar
          search={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search support resources by title, description, or tags..."
          selects={[
            { ...standardFilters.supportCategories, value: selectedCategory, onChange: setSelectedCategory, label: 'Support Category', description: 'Filter by type of support needed', options: [...standardFilters.supportCategories.options] as any },
            { id: 'priority', value: selectedPriority, onChange: setSelectedPriority, placeholder: 'All Priorities', label: 'Priority Level', description: 'Filter by urgency level', options: [ { label: 'All Priorities', value: 'all' }, { label: 'High Priority', value: 'high', description: 'Urgent support needed' }, { label: 'Medium Priority', value: 'medium', description: 'Important but not urgent' }, { label: 'Low Priority', value: 'low', description: 'General information' } ] }
          ]}
          sortOptions={[ { label: 'Priority (High to Low)', value: 'priority-desc' }, { label: 'Title A-Z', value: 'title-asc' }, { label: 'Category', value: 'category-asc' }, { label: 'Highest Rated', value: 'rating-desc' }, { label: 'Recently Updated', value: 'updated-desc' } ]}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
          sortDirection={sortDirection}
          onSortDirectionChange={setSortDirection}
          filterPresets={[ { id: 'emergency', name: 'Emergency Only', filters: { priority: 'high' }, description: 'High priority emergency resources' }, { id: 'mental-health', name: 'Mental Health', filters: { category: 'mental-health' }, description: 'Mental health and wellness support' }, { id: 'academic', name: 'Academic Help', filters: { category: 'academic' }, description: 'Academic support and tutoring' } ]}
          showActiveFilterCount
          collapsible
          defaultCollapsed={false}
          className="mb-8 max-w-6xl mx-auto"
          right={<div className="flex items-center gap-3"><Button variant={showEmergencyOnly ? 'default':'outline'} size="sm" onClick={()=>setShowEmergencyOnly(!showEmergencyOnly)} className="flex items-center gap-2 text-xs"><AlertTriangle className="h-3.5 w-3.5" /> Emergency Only</Button><Button variant="outline" size="sm" onClick={()=>{setSearchQuery('');setSelectedCategory('all');setSelectedPriority('all');setShowEmergencyOnly(false)}} className="flex items-center gap-2 text-xs"><RotateCcw className="h-3.5 w-3.5" /> Clear All</Button></div>}
        />
        <div className="mb-8 max-w-6xl mx-auto">
          <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <DialogTrigger asChild>
              <Button ref={triggerRef} size="sm" className="w-full md:w-auto">
                <MessageCircle className="h-3.5 w-3.5 mr-2" /> Request Support
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Request Support</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={requestForm.name} onChange={e=>setRequestForm(p=>({...p,name:e.target.value}))} placeholder="Your full name" required aria-required="true" autoComplete="name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={requestForm.email} onChange={e=>setRequestForm(p=>({...p,email:e.target.value}))} placeholder="your.email@student.cuilahore.edu.pk" required aria-required="true" autoComplete="email" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={requestForm.category} onValueChange={v=>setRequestForm(p=>({...p,category:v}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mental-health">Mental Health</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" value={requestForm.message} onChange={e=>setRequestForm(p=>({...p,message:e.target.value}))} placeholder="Describe your situation and how we can help..." rows={4} required aria-required="true" autoComplete="off" />
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="anonymous" 
                    name="anonymous" 
                    aria-label="Submit anonymously" 
                    checked={requestForm.isAnonymous} 
                    onChange={e=>setRequestForm(p=>({...p,isAnonymous:e.target.checked}))} 
                    className="rounded border-muted text-primary focus:ring-primary"
                  />
                  <Label htmlFor="anonymous">Submit anonymously</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={()=>setShowRequestDialog(false)}>Cancel</Button>
                  <Button onClick={handleSubmitRequest} disabled={submitting || !requestForm.name || !requestForm.email || !requestForm.message}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div aria-live="polite" {...(loading ? ({ 'aria-busy': 'true' } as any) : {})} className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Available Support Resources</h2>
          <div className="sr-only" role="status" aria-live="polite">{regularResources.length} resources shown</div>
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {Array.from({ length: 6 }).map((_,i)=>(
                <Card key={`sk-${i}`} className="p-4 border">
                  <div className="flex items-start justify-between mb-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-5/6 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-6 text-destructive max-w-4xl mx-auto">{error}</div>
          ) : regularResources.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground max-w-4xl mx-auto">No support resources found matching your criteria</div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {regularResources.map(r=> (
                <Card key={r.id} className="border hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{r.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">{r.category.replace('-', ' ')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3 text-sm">{r.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3.5 w-3.5 mr-2 text-primary" />
                        {(()=>{const c=contactToHref(r.contactInfo);return c.href? <a href={c.href} className="text-primary underline underline-offset-2 text-xs" aria-label={`Contact ${r.title}: ${r.contactInfo}`}>{c.text}</a>:<span className="text-primary text-xs">{c.text}</span>})()}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-3.5 w-3.5 mr-2 text-primary" />
                        <span className="text-primary text-xs">{r.availability}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}