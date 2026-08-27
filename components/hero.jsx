'use client';

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { NsButton } from './ui/ns-button'
import { motion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1];

const HeroSection = () => {
  return (
    <section className='px-4 mx-auto max-w-[1512px]'>
      <div
        className='relative flex min-h-[520px] flex-col items-center justify-center overflow-hidden rounded-[16px] bg-[#1c32ff] px-6 py-24 text-center sm:min-h-[620px] lg:min-h-[700px]'
      >
        {/* Ambient depth: soft radial highlight + faint grid, layered on the blue */}
        <div
          className='pointer-events-none absolute inset-0'
          style={{
            backgroundImage:
              'radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)',
          }}
        />
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.12]'
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(120% 90% at 50% 30%, #000 40%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(120% 90% at 50% 30%, #000 40%, transparent 78%)',
          }}
        />

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className='relative z-10 mb-9 sm:mb-[52px]'
        >
          <Link
            href='#features'
            className='group inline-flex items-center gap-2 rounded-sm border border-white/30 py-1.5 pl-4 pr-3.5 transition-colors hover:border-white/60 hover:bg-white/5'
          >
            <span className='text-[14px] tracking-[-0.14px] text-white'>
              Now with AI-powered interview prep
            </span>
            <ArrowUpRight className='h-3.5 w-3.5 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
          </Link>
        </motion.div>

        {/* Headline + subtext */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
          className='relative z-10 flex max-w-[900px] flex-col items-center gap-7 sm:gap-10'
        >
          <h1 className='font-heading max-w-[680px] text-balance text-[38px] font-medium leading-[0.98] tracking-[-0.02em] text-white sm:text-[50px] lg:text-[60px] lg:tracking-[-1.5px]'>
            Build the career you deserve, faster
          </h1>
          <p className='max-w-[440px] text-balance text-[18px] leading-[1.3] tracking-[-0.2px] text-white/90 sm:text-[20px]'>
            Smart resumes, AI interview prep, and personalized guidance across
            every step of your job search.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease }}
          className='relative z-10 mt-10 flex flex-col items-center gap-3.5 sm:mt-14'
        >
          <NsButton href='/dashboard' variant='white'>
            Get started free
          </NsButton>
          <p className='text-[14px] tracking-[-0.14px] text-white/90'>
            No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
