import { GraduationCap, Mail, Phone, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 p-4 md:p-6 bg-accent/10 border border-accent/30 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-center md:text-left">
            <div className="font-semibold text-foreground flex items-center justify-center md:justify-start gap-2">
              <Users className="h-5 w-5 text-primary" />
              Want to contribute or become a moderator?
            </div>
            <p className="text-sm text-muted-foreground font-serif">Help other students and shape CampusAxis with your contributions.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link href="/contribute">Contribute</Link>
            </Button>
            <a href="mailto:campusaxis0@gmail.com?subject=Contribute%20to%20CampusAxis" rel="noreferrer">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" /> Email Us
              </Button>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <div className="font-bold text-lg">COMSATS ITE</div>
                <div className="text-sm text-muted-foreground">Academic Portal</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-serif">
              Empowering COMSATS University Lahore students with comprehensive academic resources and tools.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/past-papers" className="text-muted-foreground hover:text-primary transition-colors">
                  Past Papers
                </Link>
              </li>
              <li>
                <Link href="/gpa-calculator" className="text-muted-foreground hover:text-primary transition-colors">
                  GPA Calculator
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                  Learning Resources
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="text-muted-foreground hover:text-primary transition-colors">
                  Faculty Reviews
                </Link>
              </li>
              <li>
                <Link href="/timetable" className="text-muted-foreground hover:text-primary transition-colors">
                  Timetable
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="text-muted-foreground hover:text-primary transition-colors">
                  Contribute
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/report-issue" className="text-muted-foreground hover:text-primary transition-colors">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">COMSATS University Lahore</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">campusaxis0@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+92-42-111-001-007</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2024 COMSATS ITE Academic Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
