"use client";

import { authClient } from '@/lib/auth/client';

// Hooks must be called unconditionally at the top level — never inside try/catch.
// A try/catch around a hook changes how many hooks React registers between renders,
// causing "Rendered more hooks than during the previous render."

export function useNeonAuth() {
  const sessionResult = authClient.useSession();

  const data = sessionResult?.data ?? null;
  const isLoading = sessionResult?.isLoading ?? true;
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

export function useNeonUser() {
  const sessionResult = authClient.useSession();

  const data = sessionResult?.data ?? null;
  const isLoading = sessionResult?.isLoading ?? true;
  const user = data?.user || null;

  return {
    user: user || null,
    isLoaded: !isLoading,
  };
}
