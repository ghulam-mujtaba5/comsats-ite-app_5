"use client"
import { GraduationCap, Mail, Phone, MapPin, Users, Github, Twitter, Instagram, Sparkles, BookOpen, Users2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SITE_LINKS, type PageStatus } from "@/lib/site-map"
import { usePathname } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type FooterProps = {
  hidePortalSubtitle?: boolean
}

export function Footer({ hidePortalSubtitle = false }: FooterProps) {
  const pathname = usePathname()
  const groups = {
    core: SITE_LINKS.filter(l => l.group === 'core'),
    student: SITE_LINKS.filter(l => l.group === 'student'),
    community: SITE_LINKS.filter(l => l.group === 'community'),
    support: SITE_LINKS.filter(l => l.group === 'support'),
  }

  const StatusBadge = ({ status, hideLive = false }: { status?: PageStatus; hideLive?: boolean }) => {
    if (!status) return null
    if (hideLive && status === 'live') return null
    const label = status === 'beta' ? 'Beta' : status === 'coming_soon' ? 'Coming soon' : status === 'working' ? 'Working' : 'Live'
    const cls =
      status === 'beta'
        ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
        : status === 'coming_soon'
        ? 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30'
        : status === 'working'
        ? 'bg-blue-500/15 text-blue-500 border-blue-500/30'
        : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
    return (
      <span className={`inline-flex items-center px-1.5 py-px rounded-md text-[10px] border ${cls}`}>
        {label}
      </span>
    )
  }

  const year = new Date().getFullYear()

  const iconForGroup = (group: 'core' | 'student' | 'community' | 'support') => {
    switch (group) {
      case 'student':
        return <BookOpen className="h-3.5 w-3.5 opacity-70" />
      case 'community':
        return <Users2 className="h-3.5 w-3.5 opacity-70" />
      case 'support':
        return <Sparkles className="h-3.5 w-3.5 opacity-70" />
      default:
        return <GraduationCap className="h-3.5 w-3.5 opacity-70" />
    }
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  return (
    <footer className="relative glass-card-premium glass-border-glow supports-[backdrop-filter]:glass-card rounded-2xl glass-depth glass-gradient">
      <div className="app-container py-12">
        <div className="mb-10 p-4 md:p-6 glass-card-premium glass-border-glow glass-hover-glow rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 glass-gradient glass-depth glass-floating">
          <div className="text-center md:text-left">
            <div className="font-semibold text-foreground flex items-center justify-center md:justify-start gap-2">
              <Users className="h-5 w-5 text-primary" />
              Want to contribute or become a moderator?
            </div>
            <p className="text-sm text-muted-foreground font-serif">Help other students and shape CampusAxis with your contributions.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="glass-button glass-border-light glass-hover glass-depth">
              <Link href="/contribute">Contribute</Link>
            </Button>
            <a href="mailto:campusaxis0@gmail.com?subject=Contribute%20to%20CampusAxis" rel="noreferrer">
              <Button variant="outline" className="glass-button glass-border-light glass-hover glass-depth">
                <Mail className="h-4 w-4 mr-2" /> Email Us
              </Button>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <Image 
                  src="/logo-square.svg" 
                  alt="CampusAxis Logo" 
                  width={48} 
                  height={48} 
                  className="rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300 relative z-10"
                />
              </div>
              <div>
                <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CampusAxis</div>
                {!hidePortalSubtitle && (
                  <div className="text-sm text-muted-foreground">Academic Portal</div>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-serif">
              Empowering COMSATS University Lahore students with comprehensive academic resources and tools.
            </p>
            {/* Moved Contact Info here */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Contact Info</h3>
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

          <div>
            <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-1 text-[13px]">
              {groups.core.concat(groups.student).map(link => (
                <li key={link.href} className="flex items-center justify-between gap-2 py-0.5 leading-tight">
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                  <StatusBadge status={link.status} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Community</h3>
            <ul className="space-y-1 text-[13px]">
              {groups.community.map(link => (
                <li key={link.href} className="flex items-center justify-between gap-2 py-0.5 leading-tight">
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                  <StatusBadge status={link.status} />
                </li>
              ))}
            </ul>
            {/* Social + Admin inline to save space */}
            <div className="mt-4 flex items-center gap-3 text-muted-foreground">
              <Link href="https://github.com/" aria-label="GitHub" className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com/" aria-label="Twitter" className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com/" aria-label="Instagram" className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                <Instagram className="h-5 w-5" />
              </Link>
              <span className="mx-1 h-4 w-px bg-border" />
              <Link href="/admin/login" aria-label="Admin Login" className="hover:text-primary transition-colors">
                <ShieldCheck className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Support</h3>
            <ul className="space-y-1 text-[13px]">
              {groups.support.map(link => (
                <li key={link.href} className="flex items-center justify-between gap-2 py-0.5 leading-tight">
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                  <StatusBadge status={link.status} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {year} CampusAxis{hidePortalSubtitle ? '' : ' Academic Portal'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
