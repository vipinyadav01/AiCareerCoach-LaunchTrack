"use client";

import { authClient } from '@/lib/auth/client';

/**
 * Custom hook to get Neon Auth user and session state
 * Provides similar API to Clerk's useAuth and useUser hooks
 */
export function useNeonAuth() {
  const { data, isLoading } = authClient.useSession();
  
  const user = data?.user || null;
  const session = data?.session || null;
  const isSignedIn = !!session && !!user;
  
  return {
    isLoaded: !isLoading,
    isSignedIn,
    userId: user?.id || null,
    user: user || null,
    session: session || null,
    signOut: async () => {
      await authClient.signOut();
    },
  };
}

/**
 * Hook to get current user from Neon Auth
 * Similar to Clerk's useUser hook
 */
export function useNeonUser() {
  const { data, isLoading } = authClient.useSession();
  const user = data?.user || null;
  
  return {
    user: user || null,
    isLoaded: !isLoading,
  };
}
