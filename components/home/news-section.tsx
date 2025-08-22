import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

const newsItems = [
  {
    title: "Mid-Term Examinations Schedule Released",
    description:
      "The schedule for mid-term examinations has been published. Students are advised to check their respective department portals.",
    date: "2024-03-15",
    category: "Examinations",
    image: "/placeholder-tfhrz.png",
  },
  {
    title: "New Learning Resources Added",
    description:
      "Fresh study materials and past papers for Computer Science and Engineering departments have been uploaded.",
    date: "2024-03-12",
    category: "Resources",
    image: "/placeholder-w0eji.png",
  },
  {
    title: "Faculty Development Workshop",
    description: "A workshop on modern teaching methodologies will be conducted for all faculty members next week.",
    date: "2024-03-10",
    category: "Faculty",
    image: "/university-faculty-workshop.png",
  },
  {
    title: "Student Portal Maintenance",
    description: "The student portal will undergo scheduled maintenance this weekend. Please plan accordingly.",
    date: "2024-03-08",
    category: "Technical",
    image: "/placeholder-7ca42.png",
  },
]

export function NewsSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Latest News & Updates</h2>
            <p className="text-lg text-muted-foreground font-serif">
              Stay informed about important announcements and events
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
            <Link href="/news">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsItems.map((item, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{item.category}</Badge>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-serif line-clamp-3">{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/news">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
