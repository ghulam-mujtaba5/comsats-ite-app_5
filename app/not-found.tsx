"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <Card className="p-12">
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <FileQuestion className="h-24 w-24 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">404 - Page Not Found</h1>
                <p className="text-lg text-muted-foreground">Sorry, we couldn't find the page you're looking for.</p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The page might have been moved, deleted, or you entered the wrong URL.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/">
                    <Button size="lg">
                      <Home className="h-4 w-4 mr-2" />
                      Go Home
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" onClick={() => window.history.back()} className="bg-transparent">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Looking for something specific? Try these popular sections:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/past-papers">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Past Papers
                    </Button>
                  </Link>
                  <Link href="/gpa-calculator">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      GPA Calculator
                    </Button>
                  </Link>
                  <Link href="/faculty">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Faculty Reviews
                    </Button>
                  </Link>
                  <Link href="/resources">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Learning Resources
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
