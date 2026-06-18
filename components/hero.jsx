'use client';

import Link from 'next/link'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ContainerScroll } from './ui/container-scroll-animation'
import { TextHoverEffect } from './ui/text-hover-effect'
import { TypewriterEffect } from "./ui/typewriter-effect";
import { motion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1];

const HeroSection = () => {
  const words = [
    { text: "Build" },
    { text: "the" },
    { text: "career" },
    { text: "you" },
    { text: "deserve,", className: "text-foreground" },
    { text: "faster." },
  ];

  return (
    <section className='relative w-full min-h-dvh pt-20 md:pt-24 pb-16 overflow-hidden bg-transparent'>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-primary/8 via-primary/3 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-linear-to-tr from-secondary/12 via-secondary/6 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-linear-to-tl from-muted/8 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className='relative z-10'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-8'>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 text-xs font-semibold tracking-wide bg-background/70 backdrop-blur-md border-border/60 hover:bg-background/90 transition-all duration-300 cursor-default"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5 animate-pulse inline-block shrink-0" />
                AI-Powered Career Platform
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-black leading-[0.9] tracking-tight">
                <TextHoverEffect text="ELEVATE" />
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease }}
              className="flex justify-center"
            >
              <TypewriterEffect
                words={words}
                className="text-xl sm:text-2xl md:text-3xl font-medium text-muted-foreground"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38, ease }}
              className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed"
            >
              Smart resumes, interview prep, and personalized career guidance powered by AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease }}
              className='flex flex-col sm:flex-row items-center justify-center gap-4'
            >
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-44 h-11 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                >
                  Get Started Free
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-44 h-11 rounded-xl font-semibold text-sm bg-background/60 backdrop-blur-md border-border hover:bg-background/90 transition-all duration-300 hover:scale-105"
                >
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <ContainerScroll
            titleComponent={
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-foreground tracking-tight leading-tight">
                Your career dashboard,
                <br />
                <span className="text-5xl md:text-6xl bg-linear-to-r from-foreground to-foreground/50 bg-clip-text text-transparent font-extrabold mt-3 inline-block">
                  powered by AI
                </span>
              </h2>
            }
          >
            <div className="relative w-full rounded-2xl overflow-hidden aspect-2/1 border border-border shadow-2xl bg-card/90">
              <img
                src="/banner.png"
                alt="AI Career Platform Dashboard Preview"
                height={720}
                width={1400}
                className="w-full h-full object-cover object-top-left"
                draggable={false}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/20 to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-green-500/30">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">Live</span>
              </div>
            </div>
          </ContainerScroll>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
