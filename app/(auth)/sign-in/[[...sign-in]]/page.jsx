'use client';

import Link from 'next/link';
import { NeonAuthView } from '@/components/neon-auth-ui-client';
import { useNeonAuth } from '@/hooks/use-neon-auth';
import { LogoMark } from '@/components/logo';
import { useEffect } from 'react';

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useNeonAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Hard redirect avoids Next.js App Router re-render that causes hooks count mismatch
      window.location.href = '/onboarding';
    }
  }, [isLoaded, isSignedIn]);

  // Use auth state as key so AuthView remounts on transition instead of re-rendering
  const authKey = isLoaded ? (isSignedIn ? 'signed-in' : 'signed-out') : 'loading';

  return (
    <div className="flex flex-col gap-7">
      {/* Branding */}
      <div className="flex flex-col items-center gap-3 text-center">
        <Link href="/" aria-label="Launch Track home">
          <LogoMark size={40} />
        </Link>
        <div className="space-y-1.5">
          <h1 className="font-heading text-[26px] font-medium tracking-[-0.02em] text-[#0b0b12]">
            Welcome back
          </h1>
          <p className="text-[14px] text-[#5c6070]">
            Sign in to continue to LaunchTrack
          </p>
        </div>
      </div>

      {/* Auth form */}
      <div className="rounded-2xl border border-black/10 bg-white p-2 shadow-[0_16px_40px_-24px_rgba(11,11,18,0.25)]">
        <NeonAuthView key={authKey} path="sign-in" />
      </div>

      {/* Footer link */}
      <p className="text-center text-[13px] text-[#5c6070]">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="font-medium text-[#1c32ff] hover:underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </div>
  );
}
