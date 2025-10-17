"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ExternalLink, Globe, Mail, BookOpen, Library, Calendar, 
  HelpCircle, Shield, Wifi, GraduationCap, FileText, Video 
} from "lucide-react"
import Link from "next/link"
import layout from "@/app/styles/common.module.css"
import "./student-portal.light.module.css"
import "./student-portal.dark.module.css"

interface PortalResource {
  id: string
  title: string
  description: string
  url: string
  category: string
  icon_name: string
  requires_vpn: boolean
  is_external: boolean
}

const iconMap: Record<string, any> = {
  Globe, Mail, BookOpen, Library, Calendar, 
  HelpCircle, Shield, Wifi, GraduationCap, FileText, Video
}

export default function StudentPortalPage() {
  const [resources, setResources] = useState<PortalResource[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/student-portal/resources")
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      }
    } catch (error) {
      console.error("Error fetching portal resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: "all", label: "All Services" },
    { value: "cuonline", label: "CU Online" },
    { value: "email", label: "Email" },
    { value: "lms", label: "LMS/Moodle" },
    { value: "library", label: "Library" },
    { value: "other", label: "Other" },
  ]

  const filteredResources = filter === "all" 
    ? resources 
    : resources.filter(r => r.category === filter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      </div>

      <div className={`relative ${layout.section} px-4 py-12`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700/30 text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
            <Globe className="h-4 w-4" /> 
            Quick Access
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Student <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Portal</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8 font-medium leading-relaxed">
            Quick access to all official COMSATS services and resources in one place.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <Button
              key={cat.value}
              variant={filter === cat.value ? "default" : "outline"}
              onClick={() => setFilter(cat.value)}
              className="rounded-full"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => {
              const Icon = iconMap[resource.icon_name] || Globe
              return (
                <Card key={resource.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 p-3 rounded-xl">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      {resource.requires_vpn && (
                        <Badge variant="secondary" className="text-xs">
                          <Wifi className="h-3 w-3 mr-1" />
                          VPN Required
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mt-4">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      as Child={resource.is_external ? "a" : undefined}
                      href={resource.is_external ? resource.url : undefined}
                      target={resource.is_external ? "_blank" : undefined}
                      rel={resource.is_external ? "noopener noreferrer" : undefined}
                    >
                      {resource.is_external ? (
                        <>
                          Open Service
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>Visit</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {!loading && filteredResources.length === 0 && (
          <Card className="p-12 text-center">
            <Globe className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">No Resources Found</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Try selecting a different category or check back later.
            </p>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Need Help?
            </CardTitle>
            <CardDescription>
              Having trouble accessing any service? Check our troubleshooting guides or contact support.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link href="/lms-troubleshooting">LMS Troubleshooting</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/help-desk">Submit Ticket</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/guidance">View Guides</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
