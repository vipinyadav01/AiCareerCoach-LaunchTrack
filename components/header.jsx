"use client"

import { useNeonAuth } from '@/hooks/use-neon-auth'
import { NeonUserButton } from './neon-user-button'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button, buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import { FileText, GraduationCap, Home, PenBox, Github, Menu, X, Youtube } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { GitHubStars } from './github-stars'
import { useScroll } from './use-scroll'

const Header = () => {
  const [open, setOpen] = React.useState(false)
  const [hoveredLink, setHoveredLink] = React.useState(null)
  const [mounted, setMounted] = React.useState(false)
  const scrolled = useScroll(10)
  const pathname = usePathname()
  const { isSignedIn } = useNeonAuth()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent scroll when mobile menu is open
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

  // Show only signed-out links during SSR/initial mount to prevent hydration mismatch
  const links = (mounted && isSignedIn) ? signedInLinks : signedOutLinks
  
  // Also only show Logo redirect and auth buttons after mount
  const logoHref = (mounted && isSignedIn) ? "/dashboard" : "/"
  const showUserButton = mounted && isSignedIn
  const showSignInButton = mounted && !isSignedIn

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex items-center justify-center px-4">
      <header
        className={cn(
          "flex items-center justify-between px-6 py-3 shadow-lg max-w-5xl rounded-full mx-auto w-full transition-all duration-300 border border-border/40",
          {
            "bg-background/80 backdrop-blur-md": !scrolled && !open,
            "bg-background/95 backdrop-blur-xl": scrolled,
            "bg-background": open
          }
        )}
      >
        {/* Logo */}
        <div className="shrink-0">
          <Link
            href={logoHref}
            className="flex items-center gap-2 group"
          >
            <div className="relative h-8 w-8 flex items-center justify-center">
               <img
                src="/favicon-32x32.png"
                alt="Launch Track Logo"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="hidden sm:block text-foreground text-sm font-bold tracking-tight transition-colors duration-200 group-hover:text-primary">
              Launch Track
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => {
             const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
             return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
             )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
            {/* Socials (Desktop only) */}
            <div className="hidden md:flex items-center gap-2 pr-3 border-r border-border/40">
              <a
                href="https://github.com/vipinyadav01/AiCareerCoach-LaunchTrack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Star on GitHub"
              >
                 <GitHubStars showIcon={true} showCount={false} className="gap-0!" repoUrl="vipinyadav01/AiCareerCoach-LaunchTrack" asLink={false} />
              </a>
            </div>

            <ThemeToggle />

            {/* Auth Buttons */}
            {showUserButton ? (
                <NeonUserButton />
            ) : showSignInButton ? (
                <Link href="/sign-in" className="hidden md:flex">
                    <Button size="sm" className="rounded-full px-5 h-9">
                        Get Started
                    </Button>
                </Link>
            ) : null}

            {/* Mobile Menu Toggle */}
             <button
                onClick={() => setOpen(!open)}
                className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Toggle menu"
            >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </header>

      {/* Mobile Menu Content - Floating below */}
      {open && (
         <div className="absolute top-full left-4 right-4 mt-2 p-4 rounded-3xl bg-background/95 backdrop-blur-xl border border-border/40 shadow-xl md:hidden animate-in slide-in-from-top-2 fade-in-0 flex flex-col gap-4 max-w-5xl mx-auto">
            <nav className="flex flex-col gap-2">
                {links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    const Icon = link.icon
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl transition-colors",
                                isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    )
                })}
            </nav>
            
            <div className="h-px bg-border/50 w-full" />
            
            <div className="flex flex-col gap-3">
                 <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-medium text-muted-foreground">Follow us</span>
                    <div className="flex items-center gap-4">
                        <a href="https://github.com/vipinyadav01/AiCareerCoach-LaunchTrack" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                 </div>
                 
                 {showSignInButton && (
                    <Link href="/sign-in" onClick={() => setOpen(false)}>
                        <Button className="w-full rounded-xl" size="lg">Get Started</Button>
                    </Link>
                 )}
            </div>
         </div>
      )}
    </div>
  )
}

export default Header