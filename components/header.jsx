"use client"

import { useNeonAuth } from '@/hooks/use-neon-auth'
import { NeonUserButton } from './neon-user-button'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { FileText, GraduationCap, Home, PenBox, Menu, X } from 'lucide-react'
import { IconBrandGithub } from '@tabler/icons-react'
import { ThemeToggle } from './theme-toggle'
import { GitHubStars } from './github-stars'
import { useScroll } from './use-scroll'

const Header = () => {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const scrolled = useScroll(10)
  const pathname = usePathname()
  const { isSignedIn } = useNeonAuth()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const signedInLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Resume', href: '/resume', icon: FileText },
    { label: 'Cover Letter', href: '/ai-cover-letter', icon: PenBox },
    { label: 'Interview', href: '/interview', icon: GraduationCap },
  ]

  const signedOutLinks = [
    { label: 'Home', href: '/', icon: Home },
  ]

  const links = (mounted && isSignedIn) ? signedInLinks : signedOutLinks
  const logoHref = (mounted && isSignedIn) ? "/dashboard" : "/"
  const showUserButton = mounted && isSignedIn
  const showSignInButton = mounted && !isSignedIn

  return (
    <div className="fixed top-3 left-0 right-0 z-50 px-4">
      <header
        className={cn(
          "flex items-center justify-between px-4 py-2.5 max-w-5xl rounded-2xl mx-auto w-full transition-all duration-300 border",
          scrolled || open
            ? "bg-background/98 backdrop-blur-xl border-border/70 shadow-[0_4px_32px_rgba(0,0,0,0.10)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.40)]"
            : "bg-background/70 backdrop-blur-md border-border/35 shadow-[0_2px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.20)]"
        )}
      >
        {/* Logo */}
        <Link href={logoHref} className="flex items-center gap-2.5 group shrink-0">
          <div className="h-7 w-7 flex items-center justify-center rounded-lg overflow-hidden shrink-0">
            <img
              src="/favicon-32x32.png"
              alt="Launch Track"
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="hidden sm:block text-sm font-semibold text-foreground tracking-tight transition-colors duration-200 group-hover:text-primary">
            Launch Track
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5 text-sm">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 rounded-lg font-medium transition-all duration-200",
                  isActive
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          <div className="hidden md:flex items-center">
            <a
              href="https://github.com/vipinyadav01/AiCareerCoach-LaunchTrack"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              title="Star on GitHub"
            >
              <GitHubStars
                showIcon={true}
                showCount={false}
                className="gap-0!"
                repoUrl="vipinyadav01/AiCareerCoach-LaunchTrack"
                asLink={false}
              />
            </a>
          </div>

          <ThemeToggle />

          {showUserButton && <NeonUserButton />}

          {showSignInButton && (
            <Link href="/sign-in" className="hidden md:flex">
              <Button size="sm" className="rounded-xl px-4 h-8 text-xs font-semibold">
                Get Started
              </Button>
            </Link>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-4 right-4 mt-1.5 p-3 rounded-2xl bg-background/98 backdrop-blur-xl border border-border/50 shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.45)] md:hidden animate-in slide-in-from-top-2 fade-in-0 duration-200 max-w-5xl mx-auto">
          <nav className="flex flex-col gap-0.5 mb-3">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="h-px bg-border/40 mb-3" />

          <div className="flex items-center justify-between px-1">
            <a
              href="https://github.com/vipinyadav01/AiCareerCoach-LaunchTrack"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              <IconBrandGithub size={15} />
              GitHub
            </a>

            {showSignInButton && (
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                <Button size="sm" className="rounded-xl px-4 h-8 text-xs font-semibold">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
