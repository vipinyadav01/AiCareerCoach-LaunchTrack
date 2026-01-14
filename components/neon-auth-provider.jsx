"use client";

import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import '@neondatabase/neon-js/ui/css';
import { createAuthClient } from '@neondatabase/neon-js/auth';
import { useMemo } from 'react';

export function NeonAuthProvider({ children }) {
  // Get auth URL from environment variables - must be done inside component for Next.js
  const authUrl = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_NEON_AUTH_URL || process.env.VITE_NEON_AUTH_URL)
    : process.env.NEXT_PUBLIC_NEON_AUTH_URL;
  
  // Create client instance inside component to ensure env vars are available
  const authClient = useMemo(() => {
    // Validate authUrl is a string
    if (!authUrl || typeof authUrl !== 'string' || !authUrl.trim()) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          'NEXT_PUBLIC_NEON_AUTH_URL is not set. Please add it to your .env.local file:\n' +
          'NEXT_PUBLIC_NEON_AUTH_URL=https://ep-spring-river-ahxhmxmm.neonauth.c-3.us-east-1.aws.neon.tech/neondb/auth'
        );
      }
      return null;
    }
    
    const trimmedUrl = authUrl.trim();
    
    // Validate it's a valid URL
    try {
      new URL(trimmedUrl);
    } catch (e) {
      console.error('Invalid NEXT_PUBLIC_NEON_AUTH_URL format:', trimmedUrl);
      return null;
    }
    
    try {
      return createAuthClient({
        baseUrl: trimmedUrl,
      });
    } catch (error) {
      console.error('Failed to create Neon Auth client:', error);
      return null;
    }
  }, [authUrl]);

  if (!authClient) {
    // Still render children so the app doesn't break, but auth won't work
    return <>{children}</>;
  }

  return (
    <NeonAuthUIProvider
      emailOTP
      authClient={authClient}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
