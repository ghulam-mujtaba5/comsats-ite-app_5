"use client"
import { GraduationCap, Mail, MapPin, Users, Github, Twitter, Instagram, Sparkles, BookOpen, Users2, ShieldCheck, Facebook } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SITE_LINKS, type PageStatus, type SiteLink } from "@lib/site-map"
import layout from "@/app/styles/common.module.css"
import { usePathname } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type FooterProps = {
  hidePortalSubtitle?: boolean
}

export function Footer({ hidePortalSubtitle = false }: FooterProps) {
  const pathname = usePathname()
  const groups: Record<'core' | 'student' | 'community' | 'admissions' | 'support', SiteLink[]> = {
    core: SITE_LINKS.filter(l => l.group === 'core'),
    student: SITE_LINKS.filter(l => l.group === 'student'),
    community: SITE_LINKS.filter(l => l.group === 'community'),
    admissions: SITE_LINKS.filter(l => l.group === 'admissions'),
    support: SITE_LINKS.filter(l => l.group === 'support'),
  }

  // Add a special handler for the Admin link to redirect to login if not authenticated
  const handleAdminClick = (e: React.MouseEvent) => {
    // This will be handled by the AdminGuard component on the admin page
    // We just need to ensure the link works properly
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
    <footer className="relative glass-card bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/40 rounded-2xl backdrop-blur-xl shadow-lg mx-4 sm:mx-6 lg:mx-8 mb-6 mt-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-slate-800/20 dark:via-slate-800/15 dark:to-slate-900/20 rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-500/8 to-transparent dark:from-slate-700/15 dark:to-slate-900/5 rounded-r-2xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-indigo-500/8 to-transparent dark:from-slate-800/15 dark:to-slate-900/5 rounded-bl-2xl"></div>
      <div className={`${layout.section} py-10 px-4 sm:px-6 lg:px-8 relative z-10`}>
        <div className="mb-8 p-4 md:p-5 glass-card-premium glass-border-glow glass-hover-glow rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 glass-gradient glass-depth glass-floating">
          <div className="text-center md:text-left">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              <Users className="h-5 w-5 text-primary" />
              Want to contribute or become a moderator?
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-serif">Help other students and shape CampusAxis with your contributions.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="glass-interactive">
              <Link href="/contribute">Contribute</Link>
            </Button>
            <a href="mailto:campusaxis0@gmail.com?subject=Contribute%20to%20CampusAxis" rel="noreferrer">
              <Button variant="outline" className="glass-interactive">
                <Mail className="h-4 w-4 mr-2" /> Email Us
              </Button>
            </a>
          </div>
        </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <Image 
                  src="/Campus Axis 1.svg" 
                  alt="CampusAxis Logo" 
                  width={48} 
                  height={48} 
                  className="rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300 relative z-10"
                  priority
                />
              </div>
              <div>
                <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CampusAxis</div>
                {!hidePortalSubtitle && (
                  <div className="text-sm text-muted-foreground">Academic Portal</div>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-serif">
              Empowering COMSATS University Lahore students with comprehensive academic resources and tools.
            </p>
            {/* Moved Contact Info here */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Contact Info</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">COMSATS University Lahore</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">campusaxis0@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-1 text-[13px]">
              {groups.core.filter(link => link.href !== '/admin').concat(groups.student).map(link => (
                <li key={link.href} className="flex items-center justify-between gap-2 py-0.5 leading-tight">
                  <Link href={link.href} className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                  <StatusBadge status={link.status} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Admissions</h3>
            <ul className="space-y-1 text-[13px]">
              {groups.admissions.map(link => (
                <li key={link.href} className="flex items-center justify-between gap-2 py-0.5 leading-tight">
                  <Link href={link.href} className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                  <StatusBadge status={link.status} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Community</h3>
            <ul className="space-y-1 text-[13px]">
              {groups.community.map(link => (
                <li key={link.href} className="flex items-center justify-between gap-2 py-0.5 leading-tight">
                  <Link href={link.href} className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
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
              <Link href="https://www.facebook.com/share/1CJykmBEZ3/" aria-label="Facebook" className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://www.instagram.com/campusaxis?igsh=MXgzenJtamd2cHRydQ==" aria-label="Instagram" className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                <Instagram className="h-5 w-5" />
              </Link>
              <span className="mx-1 h-4 w-px bg-border" />
              <Link href="/admin" aria-label="Admin Portal" className="hover:text-primary transition-colors" onClick={handleAdminClick}>
                <ShieldCheck className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Support</h3>
            <ul className="space-y-1 text-[13px]">
              {groups.support.map(link => (
                <li key={link.href} className="flex items-center justify-between gap-2 py-0.5 leading-tight">
                  <Link href={link.href} className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                  <StatusBadge status={link.status} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-6 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {year} CampusAxis{hidePortalSubtitle ? '' : ' Academic Portal'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
