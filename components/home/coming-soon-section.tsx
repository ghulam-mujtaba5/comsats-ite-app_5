import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Book, Users, LifeBuoy, Newspaper, Rss, Award, ShoppingCart, PackageSearch, HelpCircle, MessagesSquare } from "lucide-react"

const comingSoonFeatures = [
  {
    title: "AI-Powered Study Buddy",
    description: "Get instant answers to your academic questions, summarize long texts, and generate study notes with our intelligent assistant.",
    icon: Lightbulb,
  },
  {
    title: "Personalized Timetable & Reminders",
    description: "Create your own weekly timetable, set reminders for classes and exams, and never miss an important deadline again.",
    icon: Book,
  },
  {
    title: "Student Community & Forums",
    description: "Connect with fellow students, join study groups, ask questions, and share your knowledge in a dedicated community forum.",
    icon: Users,
  },
  {
    title: "Student Support",
    description: "Get dedicated support for academic and personal challenges, ensuring a smooth university experience.",
    icon: LifeBuoy,
  },
  {
    title: "News and Events",
    description: "Stay updated with the latest campus news, announcements, and upcoming events all in one place.",
    icon: Newspaper,
  },
  {
    title: "Blogs Section",
    description: "Read and share articles, stories, and insights from students and faculty on a variety of topics.",
    icon: Rss,
  },
  {
    title: "Ambassador Program",
    description: "Join our student ambassador program to represent the university, gain leadership skills, and earn rewards.",
    icon: Award,
  },
  {
    title: "COMSATS OLX",
    description: "A marketplace for students to buy and sell used books, electronics, and other essentials within the campus community.",
    icon: ShoppingCart,
  },
  {
    title: "COMSATS Lost and Found",
    description: "Lost something on campus? Post it here. Found something? Help it find its way back to the owner.",
    icon: PackageSearch,
  },
  {
    title: "Help Desk",
    description: "A centralized help desk to get answers to your queries regarding admissions, fees, and other administrative matters.",
    icon: HelpCircle,
  },
  {
    title: "Discussion Platform",
    description: "Engage in meaningful discussions with peers and faculty on course-related topics and general interests.",
    icon: MessagesSquare,
  },
]

export function ComingSoonSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Exciting New Features Coming Soon!</h2>
          <p className="text-lg text-muted-foreground mt-4 font-serif">We're constantly working to enhance your academic experience. Here's a sneak peek of what's next.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {comingSoonFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-background shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-serif">{feature.description}</p>
                  <Badge className="mt-4">Coming Soon</Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
