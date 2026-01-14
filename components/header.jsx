"use client"

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button, buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import { FileText, GraduationCap, Home, PenBox, Github } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { GitHubStars } from './github-stars'
import { MenuToggleIcon } from './menu-toggle-icon'
import { useScroll } from './use-scroll'

const Header = () => {
  const [open, setOpen] = React.useState(false)
  const [hoveredLink, setHoveredLink] = React.useState(null)
  const scrolled = useScroll(10)
  const pathname = usePathname()

  React.useEffect(() => {
    if (open) {
      // Disable scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Re-enable scroll
      document.body.style.overflow = ''
    }

    // Cleanup when component unmounts (important for Next.js)
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const signedInLinks = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      label: 'Resume',
      href: '/resume',
      icon: FileText,
    },
    {
      label: 'Cover Letter',
      href: '/ai-cover-letter',
      icon: PenBox,
    },
    {
      label: 'Interview',
      href: '/interview',
      icon: GraduationCap,
    },
  ]

  const signedOutLinks = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
    },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
        {
          'bg-background/95 supports-backdrop-filter:bg-background/50 border-border backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow':
            scrolled && !open,
          'bg-background/90': open,
        }
      )}>
      <nav
        className={cn(
          'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
          {
            'md:px-2': scrolled,
          }
        )}>
        {/* Logo */}
        <SignedOut>
          <Link
            href="/"
            className="flex items-center gap-2 group transition-all duration-200 hover:scale-105"
            onMouseEnter={() => setHoveredLink('logo')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <div className="h-8 w-8 flex items-center justify-center rounded-md transition-all duration-200 group-hover:rotate-12 group-hover:shadow-lg">
              <img
                src="/favicon-32x32.png"
                alt="Launch Track Logo"
                className="h-6 w-6 object-contain transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            <span className="text-foreground text-sm font-bold font-nav tracking-tight hidden sm:block transition-colors duration-200 group-hover:text-primary">
              Launch Track
            </span>
          </Link>
        </SignedOut>
        <SignedIn>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group transition-all duration-200 hover:scale-105"
            onMouseEnter={() => setHoveredLink('logo')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <div className="h-8 w-8 flex items-center justify-center rounded-md transition-all duration-200 group-hover:rotate-12 group-hover:shadow-lg">
              <img
                src="/favicon-32x32.png"
                alt="Launch Track Logo"
                className="h-6 w-6 object-contain transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            <span className="text-foreground text-sm font-bold font-nav tracking-tight hidden sm:block transition-colors duration-200 group-hover:text-primary">
              Launch Track
            </span>
          </Link>
        </SignedIn>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <SignedIn>
            {signedInLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'relative transition-all duration-200 group',
                    isActive && 'text-primary font-semibold',
                    'hover:scale-105 hover:text-primary'
                  )}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <Icon className={cn(
                    "w-4 h-4 mr-2 transition-all duration-200",
                    isActive && "scale-110",
                    hoveredLink === link.href && "scale-110 rotate-12"
                  )} />
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              )
            })}
            <span className="mx-1 w-px h-6 bg-border/40 rounded-full" aria-hidden="true"></span>
            <ThemeToggle />
            <div className="flex items-center gap-2 ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 relative z-10",
                    userButtonPopoverCard: "bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-xl",
                    userButtonPopoverActionButton: "text-foreground hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 font-nav",
                    userPreviewMainIdentifier: "font-medium font-nav text-foreground text-sm",
                    userPreviewSecondaryIdentifier: "text-muted-foreground text-xs font-nav"
                  }
                }}
              />
              <div className="hidden lg:flex items-center gap-1">
                <Github className="w-4 h-4 text-muted-foreground" />
                <GitHubStars className="text-muted-foreground" showIcon={false} />
              </div>
            </div>
          </SignedIn>
          <SignedOut>
            {signedOutLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'relative transition-all duration-200 group',
                    isActive && 'text-primary font-semibold',
                    'hover:scale-105 hover:text-primary'
                  )}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <Icon className={cn(
                    "w-4 h-4 mr-2 transition-all duration-200",
                    isActive && "scale-110",
                    hoveredLink === link.href && "scale-110 rotate-12"
                  )} />
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              )
            })}
            <Link href="/sign-in">
              <Button
                variant="outline"
                className="transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                Sign In
              </Button>
            </Link>
            <span className="mx-1 w-px h-6 bg-border/40 rounded-full" aria-hidden="true"></span>
            <ThemeToggle />
            <div className="hidden lg:flex items-center gap-1 ml-2">
              <Github className="w-4 h-4 text-muted-foreground" />
              <GitHubStars className="text-muted-foreground" showIcon={false} />
            </div>
          </SignedOut>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <SignedIn>
            <div className="flex items-center gap-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 relative z-10",
                    userButtonPopoverCard: "bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-xl",
                    userButtonPopoverActionButton: "text-foreground hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 font-nav",
                    userPreviewMainIdentifier: "font-medium font-nav text-foreground text-sm",
                    userPreviewSecondaryIdentifier: "text-muted-foreground text-xs font-nav"
                  }
                }}
              />
            </div>
          </SignedIn>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setOpen(!open)}
            className="md:hidden">
            <MenuToggleIcon open={open} className="size-5" duration={300} />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
          open ? 'block' : 'hidden'
        )}>
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
            'flex h-full w-full flex-col justify-between gap-y-2 p-4'
          )}>
          <div className="grid gap-y-2">
            <SignedIn>
              {signedInLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                        className: 'justify-start transition-all duration-200',
                      }),
                      isActive && 'bg-primary/10 text-primary font-semibold',
                      'hover:bg-primary/5 hover:scale-[1.02]'
                    )}>
                    <Icon className={cn(
                      "w-4 h-4 mr-2 transition-all duration-200",
                      isActive && "scale-110"
                    )} />
                    {link.label}
                  </Link>
                )
              })}
            </SignedIn>
            <SignedOut>
              {signedOutLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                        className: 'justify-start transition-all duration-200',
                      }),
                      isActive && 'bg-primary/10 text-primary font-semibold',
                      'hover:bg-primary/5 hover:scale-[1.02]'
                    )}>
                    <Icon className={cn(
                      "w-4 h-4 mr-2 transition-all duration-200",
                      isActive && "scale-110"
                    )} />
                    {link.label}
                  </Link>
                )
              })}
            </SignedOut>
          </div>
          <div className="flex flex-col gap-2">
            <SignedOut>
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full transition-all duration-200 hover:scale-105">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Github className="w-4 h-4 text-muted-foreground" />
              <GitHubStars className="text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header