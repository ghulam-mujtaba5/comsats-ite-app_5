import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Card className="p-12">
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Loading...</h2>
              <p className="text-muted-foreground">Please wait while we load the content.</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
