"use client";

import { authClient } from '@/lib/auth/client';

/**
 * Custom hook to get Neon Auth user and session state
 * Provides similar API to Clerk's useAuth and useUser hooks
 */
export function useNeonAuth() {
  let data = null;
  let isLoading = true;
  try {
    const res = authClient.useSession();
    data = res?.data ?? null;
    isLoading = res?.isLoading ?? false;
  } catch (err) {
    // If Neon Auth client isn't ready or throws, fail gracefully
    console.error("NeonAuth: failed to initialize session", err);
    data = null;
    isLoading = false;
  }

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
      try {
        await authClient.signOut();
      } catch (e) {
        console.error("NeonAuth: signOut failed", e);
      }
    },
  };
}

/**
 * Hook to get current user from Neon Auth
 * Similar to Clerk's useUser hook
 */
export function useNeonUser() {
  let data = null;
  let isLoading = true;
  try {
    const res = authClient.useSession();
    data = res?.data ?? null;
    isLoading = res?.isLoading ?? false;
  } catch (err) {
    console.error("NeonAuth: failed to fetch user", err);
    data = null;
    isLoading = false;
  }

  const user = data?.user || null;
  return {
    user: user || null,
    isLoaded: !isLoading,
  };
}
