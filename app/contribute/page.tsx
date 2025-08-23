"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Users, Shield } from "lucide-react"
import Link from "next/link"

export default function ContributePage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-16">
      <section className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">Contribute to CampusAxis</h1>
        <p className="text-muted-foreground font-serif max-w-2xl mx-auto">
          Want to help fellow COMSATS students? You can contribute past papers, resources, fix bugs, or
          even join as an admin/moderator to support the community.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Users className="h-5 w-5 text-primary" /> Join as Moderator</CardTitle>
            <CardDescription>Help review content, answer questions, and keep the community helpful.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Shield className="h-5 w-5 text-primary" /> Become an Admin</CardTitle>
            <CardDescription>Lead features, manage submissions, and guide the product roadmap.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Mail className="h-5 w-5 text-primary" /> Contribute Content</CardTitle>
            <CardDescription>Share past papers, notes, or resources to help others excel.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-accent/40">
        <CardHeader>
          <CardTitle className="text-2xl">Get in Touch</CardTitle>
          <CardDescription>
            Email us your interest and details (name, department, student ID, how you want to help) — we respond quickly.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">Email:</span> campusaxis0@gmail.com
          </div>
          <div className="flex gap-3">
            <a href="mailto:campusaxis0@gmail.com?subject=Contribute%20to%20CampusAxis" rel="noreferrer">
              <Button>
                <Mail className="h-4 w-4 mr-2" /> Email Us
              </Button>
            </a>
            <Button variant="outline" asChild>
              <Link href="/report-issue">Report an Issue</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
