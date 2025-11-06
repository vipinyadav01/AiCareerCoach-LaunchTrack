"use client"

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { FileText, GraduationCap, LayoutDashboard, PenBox, Menu, Sun, Moon, Home, Github } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ThemeToggle } from './theme-toggle'
import { GitHubStars } from './github-stars'

const Header = () => {
  return (
    <div className="fixed top-1.5 left-0 w-screen h-16 sm:h-18 bg-transparent z-50 flex gap-1 sm:gap-2 items-center justify-center px-2">
      <div className="h-full w-auto px-2 sm:px-3 md:px-4 flex items-center justify-center relative group transition-transform duration-200 hover:scale-105">
        <SignedOut>
          <Link href="/" className="flex items-center gap-2 sm:gap-3 relative z-10">
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-lg bg-background/80 shadow-md border border-border/50 transition-all">
              <img
                src="/favicon-32x32.png"
                alt="Launch Track Logo"
                className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
                style={{ minWidth: 28, minHeight: 28 }}
              />
            </div>
            <span className="ml-1 sm:ml-2 text-foreground text-sm sm:text-base md:text-lg font-bold font-nav tracking-tight max-sm:hidden">
              Launch Track
            </span>
          </Link>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 relative z-10">
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-lg bg-background/80 shadow-md border border-border/50 transition-all">
              <img
                src="/favicon-32x32.png"
                alt="Launch Track Logo"
                className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
                style={{ minWidth: 28, minHeight: 28 }}
              />
            </div>
            <span className="ml-1 sm:ml-2 text-foreground text-sm sm:text-base md:text-lg font-bold font-nav tracking-tight max-sm:hidden">
              Launch Track
            </span>
          </Link>
        </SignedIn>
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Navigation Section */}
      <div className="h-full flex-1 max-w-4xl bg-background/60 backdrop-blur-lg rounded-lg flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden border border-border/30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 20">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <SignedIn>
          <nav className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 relative z-10 w-full justify-center">
            <Link href="/dashboard" className="flex items-center gap-1 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-primary/10 transition-all duration-200 group border border-transparent hover:border-primary/20 hover:shadow-sm">
              <div className="p-1 sm:p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-colors" />
              </div>
              <span className="hidden sm:block text-xs sm:text-sm md:text-base font-bold font-nav text-foreground group-hover:text-primary transition-colors">
                Dashboard
              </span>
            </Link>

            <Link href="/resume" className="flex items-center gap-1 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-primary/10 transition-all duration-200 group border border-transparent hover:border-primary/20 hover:shadow-sm">
              <div className="p-1 sm:p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-colors" />
              </div>
              <span className="hidden sm:block text-xs sm:text-sm md:text-base font-bold font-nav text-foreground group-hover:text-primary transition-colors">
                Resume
              </span>
            </Link>

            <Link href="/ai-cover-letter" className="flex items-center gap-1 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-primary/10 transition-all duration-200 group border border-transparent hover:border-primary/20 hover:shadow-sm">
              <div className="p-1 sm:p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <PenBox className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-colors" />
              </div>
              <span className="hidden sm:block text-xs sm:text-sm md:text-base font-bold font-nav text-foreground group-hover:text-primary transition-colors">
                Cover Letter
              </span>
            </Link>

            <Link href="/interview" className="flex items-center gap-1 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-primary/10 transition-all duration-200 group border border-transparent hover:border-primary/20 hover:shadow-sm">
              <div className="p-1 sm:p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-colors" />
              </div>
              <span className="hidden sm:block text-xs sm:text-sm md:text-base font-bold font-nav text-foreground group-hover:text-primary transition-colors">
                Interview
              </span>
            </Link>

            <span className="mx-1 w-px h-6 bg-border/40 rounded-full" aria-hidden="true"></span>
            <ThemeToggle />
          </nav>
        </SignedIn>

        <SignedOut>
          <nav className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 relative z-10 w-full justify-center">
            <Link href="/" className="flex items-center gap-1 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-primary/10 transition-all duration-200 group border border-transparent hover:border-primary/20">
              <div className="p-1 sm:p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-colors" />
              </div>
              <span className="hidden sm:block text-xs sm:text-sm md:text-base font-bold font-nav text-foreground group-hover:text-primary transition-colors">
                Home
              </span>
            </Link>

            <Link href="/sign-in" className="flex items-center gap-1 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-primary/10 transition-all duration-200 group border border-transparent hover:border-primary/20">
              <div className="p-1 sm:p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M21 12H9" />
                </svg>
              </div>
              <span className="hidden sm:block text-xs sm:text-sm md:text-base font-bold font-nav text-foreground/70 group-hover:text-primary transition-colors">
                Sign In
              </span>
            </Link>
            <span className="mx-1 w-px h-6 bg-border/40 rounded-full" aria-hidden="true"></span>
            <ThemeToggle />
          </nav>
        </SignedOut>
      </div>

      {/* User Section */}
      <SignedIn>
        <div className="h-full w-auto min-w-fit bg-background/80 backdrop-blur-lg rounded-lg flex flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group border border-border/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 sm:w-9 sm:h-9 relative z-10",
                userButtonPopoverCard: "bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-xl",
                userButtonPopoverActionButton: "text-foreground hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 font-nav",
                userPreviewMainIdentifier: "font-medium font-nav text-foreground text-sm",
                userPreviewSecondaryIdentifier: "text-muted-foreground text-xs font-nav"
              }
            }}
          />
          <div className="hidden lg:flex items-center gap-1 relative z-10">
            <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <GitHubStars className="text-muted-foreground group-hover:text-primary transition-colors" showIcon={false} />
          </div>
          <div className="lg:hidden relative z-10">
            <GitHubStars className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="h-full w-auto min-w-fit bg-background/80 backdrop-blur-lg rounded-lg flex flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group border border-border/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="hidden lg:flex items-center gap-1 relative z-10">
            <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <GitHubStars className="text-muted-foreground group-hover:text-primary transition-colors" showIcon={false} />
          </div>
          <div className="lg:hidden relative z-10">
            <GitHubStars className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </SignedOut>

      {/* Hidden Mobile Menu (unused but kept for potential future use) */}
      <div className="hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Header