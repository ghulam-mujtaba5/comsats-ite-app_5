"use client"

import type { Metadata } from "next";
import { useState } from "react";
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle, Clock, Users, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: "Contact Us — CampusAxis",
  description: "Get in touch with the CampusAxis team. We typically reply within 24 hours.",
  path: "/contact",
  keywords: ["contact", "support", "CampusAxis", "COMSATS"],
})

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: "COMSATS University Lahore, Defence Road, Off Raiwind Road, Lahore.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "campusaxis0@gmail.com",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      href: "mailto:campusaxis0@gmail.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+92-42-111-001-007",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      href: "tel:+924211100107"
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Monday - Friday, 9:00 AM - 5:00 PM",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30"
    }
  ]

  const quickActions = [
    {
      title: "Report a Bug",
      description: "Found an issue? Let us know!",
      href: "/report-issue",
      icon: MessageCircle,
      color: "text-red-500"
    },
    {
      title: "Join Community",
      description: "Connect with other students",
      href: "/community",
      icon: Users,
      color: "text-purple-500"
    },
    {
      title: "Contribute",
      description: "Help improve CampusAxis",
      href: "/contribute",
      icon: Sparkles,
      color: "text-yellow-500"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <main className="flex-1 py-16 px-4 relative">
        <div className="app-container max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="soft" className="mb-6 animate-fade-in">
              <MessageCircle className="h-3 w-3 mr-1" />
              Get in Touch
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance animate-slide-up" style={{ animationDelay: '200ms' }}>
              Contact <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Us</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif leading-relaxed animate-slide-up" style={{ animationDelay: '400ms' }}>
              We're here to help. Reach out with any questions, feedback, or suggestions. 
              We typically respond within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card variant="glass" className="p-8 hover-lift transition-all duration-500">
                <CardHeader className="px-0 pb-6">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Send className="h-5 w-5" />
                    </div>
                    Send us a Message
                  </CardTitle>
                  <p className="text-muted-foreground font-serif">
                    Fill out the form below and our team will get back to you as soon as possible.
                  </p>
                </CardHeader>
                
                <CardContent className="px-0">
                  {isSubmitted ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-semibold">Message Sent!</h3>
                      <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            placeholder="Enter your full name" 
                            required
                            className="transition-all duration-200 focus:scale-[1.01]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Enter your email address" 
                            required
                            className="transition-all duration-200 focus:scale-[1.01]"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                          id="subject" 
                          placeholder="What's this about?" 
                          required
                          className="transition-all duration-200 focus:scale-[1.01]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us more about your inquiry..." 
                          className="min-h-[120px] transition-all duration-200 focus:scale-[1.01]" 
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full interactive hover-lift" 
                        disabled={isSubmitting}
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card variant="glass" className="p-6 hover-lift transition-all duration-500">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                  <p className="text-sm text-muted-foreground">Multiple ways to reach us</p>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    const content = info.href ? (
                      <a href={info.href} className="hover:text-primary transition-colors">
                        {info.content}
                      </a>
                    ) : (
                      info.content
                    )
                    
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className={`p-2 rounded-lg ${info.bgColor} flex-shrink-0`}>
                          <Icon className={`h-4 w-4 ${info.color}`} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{info.title}</div>
                          <div className="text-sm text-muted-foreground">{content}</div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card variant="glass" className="p-6 hover-lift transition-all duration-500">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <p className="text-sm text-muted-foreground">Common help options</p>
                </CardHeader>
                <CardContent className="px-0 space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Link 
                        key={index} 
                        href={action.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-all hover-lift group"
                      >
                        <Icon className={`h-4 w-4 ${action.color} group-hover:scale-110 transition-transform`} />
                        <div>
                          <div className="font-medium text-sm group-hover:text-primary transition-colors">{action.title}</div>
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        </div>
                      </Link>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Help Section */}
          <Card variant="soft" className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Need immediate help?</h3>
            <p className="text-muted-foreground mb-6 font-serif">
              Check out our help center for common questions and guides, 
              or join our community to get help from fellow students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="interactive hover-lift" asChild>
                <Link href="/help">Visit Help Center</Link>
              </Button>
              <Button className="interactive hover-lift" asChild>
                <Link href="/community">Join Community</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])) }}
      />
    </div>
  );
}
