"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useNeonAuth } from '@/hooks/use-neon-auth'
import { NeonUserButton } from './neon-user-button'
import { NsButton } from './ui/ns-button'
import { Logo } from './logo'
import { useScroll } from './use-scroll'
import { cn } from '@/lib/utils'

const NavLink = ({ href, label, active, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "relative font-medium text-[15px] text-[#0b0b12] transition-colors hover:text-[#1c32ff]",
      "after:absolute after:inset-x-0 after:-bottom-2 after:h-[1.5px] after:origin-left after:bg-[#1c32ff] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100",
      active ? "text-[#1c32ff] after:scale-x-100" : "after:scale-x-0"
    )}
  >
    {label}
  </Link>
)

const Header = () => {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const scrolled = useScroll(10)
  const pathname = usePathname()
  const { isSignedIn } = useNeonAuth()

  React.useEffect(() => { setMounted(true) }, [])

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const signedIn = mounted && isSignedIn

  const links = signedIn
    ? [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Resume', href: '/resume' },
      { label: 'Cover Letter', href: '/ai-cover-letter' },
      { label: 'Interview', href: '/interview' },
    ]
    : [
      { label: 'Features', href: '/#features' },
      { label: 'Success stories', href: '/#testimonials' },
      { label: 'FAQ', href: '/#faq' },
    ]

  const isActive = (href) => {
    const path = href.replace('/#', '#')
    if (path.startsWith('#')) return false
    return pathname === href || (href !== '/' && pathname.startsWith(href))
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl rounded-b-md bg-white transition-shadow",
        scrolled || open ? "shadow-[0_8px_30px_rgba(11,11,18,0.08)]" : "lg:shadow-lg"
      )}
    >
      <div className="flex h-[72px] items-center justify-between px-6 xl:px-10">
        {/* Logo */}
        <Logo href={signedIn ? '/dashboard' : '/'} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} active={isActive(link.href)} />
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {signedIn ? (
            <NeonUserButton />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="flex h-[44px] items-center justify-center px-5 text-[15px] font-medium text-[#0b0b12] transition-colors hover:bg-black/[0.05] rounded-sm"
              >
                Log in
              </Link>
              <NsButton href="/dashboard">Get started</NsButton>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-sm text-[#0b0b12] transition-colors hover:bg-black/[0.05] lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-black/10 bg-white px-6 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-black/[0.06] py-3.5 text-[15px] font-medium text-[#0b0b12] hover:text-[#1c32ff]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {!signedIn && (
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="flex h-[44px] items-center justify-center rounded-sm border border-black/15 text-[15px] font-medium text-[#0b0b12] hover:bg-black/[0.04]"
              >
                Log in
              </Link>
              <NsButton href="/dashboard" className="justify-center" onClick={() => setOpen(false)}>
                Get started
              </NsButton>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
