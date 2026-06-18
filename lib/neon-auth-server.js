import { neonAuth } from '@neondatabase/auth/next/server';

/**
 * Server-side Neon Auth utilities
 * Use these in Server Components and Server Actions
 */

/**
 * Get the current user from Neon Auth (server-side)
 * @returns {Promise<{id: string, email: string, name?: string} | null>}
 */
export async function getCurrentUser() {
  try {
    const { user } = await neonAuth();
    return user || null;
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
  try {
    const { user } = await neonAuth();
    return user?.id || null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

/**
 * Check if user is authenticated (server-side)
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  try {
    const { session } = await neonAuth();
    return !!session;
  } catch (error) {
    return false;
  }
}

/**
 * Get session data (server-side)
 * @returns {Promise<{session: any, user: any} | null>}
 */
export async function getSession() {
  try {
    const { session, user } = await neonAuth();
    return { session, user } || null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}
