"use client";

import { createAuthClient } from '@neondatabase/neon-js/auth';

/**
 * Neon Auth Client Configuration
 * Initialize the Neon Auth client with the auth URL from environment variables
 */
const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL || process.env.VITE_NEON_AUTH_URL;

export const authClient = authUrl ? createAuthClient({
  baseUrl: authUrl,
}) : null;

// Server-side auth utilities
export async function getCurrentUser() {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    
    // Neon Auth stores session in cookies - check common cookie names
    const sessionToken = cookieStore.get('neon-auth-session')?.value || 
                         cookieStore.get('auth-session')?.value ||
                         cookieStore.get('session')?.value;
    
    if (!sessionToken) {
      return null;
    }

    // Verify and get user from Neon Auth
    const user = await authClient.getUser({ sessionToken });
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get user ID from session (server-side)
 * @returns {Promise<string | null>}
 */
export async function getUserId() {
  const user = await getCurrentUser();
  return user?.id || null;
}
