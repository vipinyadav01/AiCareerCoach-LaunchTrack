'use client';

import Link from 'next/link';
import { AuthView } from '@neondatabase/auth/react';
import { useNeonAuth } from '@/hooks/use-neon-auth';
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
  // with a different internal hook count (which would crash the component)
  const authKey = isLoaded ? (isSignedIn ? 'signed-in' : 'signed-out') : 'loading';

  return (
    <div className="flex flex-col gap-6">
      {/* Branding */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center justify-center">
          <img
            src="/favicon-32x32.png"
            alt="Launch Track"
            className="h-9 w-9 object-contain"
          />
        </Link>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to Launch Track
        </p>
      </div>

      {/* Auth form */}
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-1 shadow-sm">
        <AuthView key={authKey} path="sign-in" />
      </div>

      {/* Footer link */}
      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-foreground font-medium hover:underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </div>
  );
}
