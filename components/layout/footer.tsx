import { GraduationCap, Mail, Phone, MapPin, Users, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SITE_LINKS, type PageStatus } from "@/lib/site-map"

type FooterProps = {
  hidePortalSubtitle?: boolean
}

export function Footer({ hidePortalSubtitle = false }: FooterProps) {
  const groups = {
    core: SITE_LINKS.filter(l => l.group === 'core'),
    student: SITE_LINKS.filter(l => l.group === 'student'),
    community: SITE_LINKS.filter(l => l.group === 'community'),
    support: SITE_LINKS.filter(l => l.group === 'support'),
  }

  const StatusBadge = ({ status }: { status?: PageStatus }) => {
    if (!status) return null
    const label = status === 'beta' ? 'Beta' : status === 'coming_soon' ? 'Coming soon' : status === 'working' ? 'Working' : 'Live'
    const cls =
      status === 'beta'
        ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
        : status === 'coming_soon'
        ? 'bg-muted text-muted-foreground border-border'
        : status === 'working'
        ? 'bg-blue-500/15 text-blue-500 border-blue-500/30'
        : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] border ${cls}`}>
        {label}
      </span>
    )
  }

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
                <div className="font-bold text-lg">CampusAxis</div>
                {!hidePortalSubtitle && (
                  <div className="text-sm text-muted-foreground">Academic Portal</div>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-serif">
              Empowering COMSATS University Lahore students with comprehensive academic resources and tools.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {groups.core.concat(groups.student).map(link => (
                <li key={link.href} className="flex items-center justify-between gap-2">
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                  <StatusBadge status={link.status} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              {groups.support.map(link => (
                <li key={link.href} className="flex items-center justify-between gap-2">
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                  <StatusBadge status={link.status} />
                </li>
              ))}
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

        {/* Explore - minimal pills */}
        <div className="mt-10">
          <h3 className="font-semibold text-foreground mb-3">Explore</h3>
          {(() => {
            const exploreLinks = SITE_LINKS.filter(l => ['core','student','community'].includes(l.group)).slice(0, 8)
            return (
              <ul className="flex flex-wrap gap-2">
                {exploreLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-accent/10 transition-colors"
                    >
                      <span className="font-medium">{link.label}</span>
                      <StatusBadge status={link.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )
          })()}
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 CampusAxis{hidePortalSubtitle ? '' : ' Academic Portal'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
