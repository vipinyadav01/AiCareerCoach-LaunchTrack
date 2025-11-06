import React from 'react'
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-muted/30 backdrop-blur-md border-t border-border/40 py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">LaunchTrack</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered career platform helping professionals accelerate their career growth with personalized guidance.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/vipinyadav01" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="mailto:contact@launchtrack.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={20} />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/resume" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Resume</Link></li>
              <li><Link href="/ai-cover-letter" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cover Letter</Link></li>
              <li><Link href="/interview" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Interview Prep</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link></li>
              <li><Link href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LaunchTrack. All rights reserved. Built with ❤️ by <Link href="https://github.com/vipinyadav01" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vipin Yadav</Link>
            </p>
            <p className="text-xs text-muted-foreground">
              Made for Students & professionals worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
