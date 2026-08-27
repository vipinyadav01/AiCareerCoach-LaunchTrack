import React from 'react'
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { Logo } from './logo'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'AI Resume', href: '/resume' },
      { label: 'Cover Letter', href: '/ai-cover-letter' },
      { label: 'Interview Prep', href: '/interview' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Success stories', href: '/#testimonials' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'GitHub', href: 'https://github.com/vipinyadav01/AiCareerCoach-LaunchTrack', external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Sign in', href: '/sign-in' },
      { label: 'Get started', href: '/dashboard' },
      { label: 'Onboarding', href: '/onboarding' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
]

export const Footer = () => {
  return (
    <footer className="relative bg-[#0b0b12] px-6 pt-20 text-white lg:px-16">
      <div className="mx-auto flex max-w-[1402px] flex-col gap-16 lg:flex-row lg:gap-32">
        {/* Brand */}
        <div className="flex max-w-[420px] flex-col items-start gap-6">
          <Logo href="/" tone="light" size={30} />
          <p className="text-[14px] leading-[1.6] text-white/60">
            The AI career platform that helps professionals build stronger
            resumes, prepare for interviews, and plan their next move.
          </p>
          <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-[13px] font-semibold text-white/80">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            All systems operational
          </span>
        </div>

        {/* Link columns */}
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[15px] font-semibold text-white/50">{col.title}</p>
              <ul className="mt-4 flex flex-col">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="block py-2 text-[14px] text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-[70px] flex max-w-[1402px] flex-col gap-4 border-t border-white/10 pb-8 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] text-white/50">
          © {new Date().getFullYear()} Launch Track. Built by{' '}
          <Link
            href="https://github.com/vipinyadav01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white"
          >
            Vipin Yadav
          </Link>
          .
        </p>
        <div className="flex items-center gap-5 text-white/70">
          <Link href="#" className="text-[14px] hover:text-white">Privacy</Link>
          <Link href="#" className="text-[14px] hover:text-white">Terms</Link>
          <span className="h-4 w-px bg-white/15" />
          <Link href="https://github.com/vipinyadav01/AiCareerCoach-LaunchTrack" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white">
            <Github size={18} />
          </Link>
          <Link href="#" aria-label="LinkedIn" className="hover:text-white">
            <Linkedin size={18} />
          </Link>
          <Link href="mailto:support@learnerfast.com" aria-label="Email" className="hover:text-white">
            <Mail size={18} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
