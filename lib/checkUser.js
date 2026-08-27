import { getCurrentUser } from "./neon-auth-server";
import { db, executeWithRetry } from "./prisma";
import { cache } from "react";

/**
 * Check and sync user from Neon Auth to Prisma database
 * Falls back gracefully if database is unavailable
 * 
 * Uses React cache to memoize within a single request to prevent duplicate calls
 * Only updates database if user data has actually changed
 */
const checkUserImpl = async () => {
  const startTime = Date.now();
  
  try {
    const neonUser = await getCurrentUser();

    if (!neonUser) {
      return null;
    }

    try {
      // Extract user information from Neon Auth.
      // Better Auth exposes the avatar as `image` (fall back to `imageUrl` for safety).
      const name = neonUser.name || neonUser.email?.split('@')[0] || 'User';
      const email = neonUser.email;
      const imageUrl = neonUser.image ?? neonUser.imageUrl ?? null;

      if (!email) {
        // User has no email address (logging removed)
        return null;
      }

      // First, check if user exists and if data has changed
      let existingUser;
      try {
        existingUser = await executeWithRetry(async () => {
          return await db.user.findUnique({
            where: { neonUserId: neonUser.id },
            select: {
              id: true,
              name: true,
              email: true,
              imageUrl: true,
              skills: true,
            },
          });
        });

        // If user exists and data hasn't changed, return early without update
        if (existingUser) {
          const dataChanged =
            existingUser.name !== name ||
            existingUser.email !== email ||
            existingUser.imageUrl !== imageUrl;

          if (!dataChanged) {
            // Data hasn't changed, return existing user without logging or database write
            return existingUser;
          }
        }

        // Only perform upsert if user doesn't exist or data has changed
        const loggedInUser = await executeWithRetry(async () => {
          return await db.user.upsert({
            where: { neonUserId: neonUser.id },
            update: {
              name,
              imageUrl,
              email,
              // Update timestamps are handled automatically by Prisma
            },
            create: {
              neonUserId: neonUser.id,
              name,
              imageUrl,
              email,
              // Initialize empty arrays for skills
              skills: [],
            },
          });
        });

        // User synced successfully (logging removed)

        return loggedInUser;
      } catch (upsertError) {
        // Handle case where email already exists with different neonUserId
        // This can happen if a user was created directly in the DB
        if (
          upsertError.code === 'P2002' &&
          upsertError.meta?.target?.includes('email')
        ) {
          // Email uniqueness constraint violation - find existing user by email
          const existingUserByEmail = await executeWithRetry(async () => {
            return await db.user.findUnique({
              where: { email },
            });
          });

          if (existingUserByEmail) {
            // Update the existing user's neonUserId and other fields
            const mergedUser = await executeWithRetry(async () => {
              return await db.user.update({
                where: { id: existingUserByEmail.id },
                data: {
                  neonUserId: neonUser.id,
                  name,
                  imageUrl,
                },
              });
            });

            // User merged by email (logging removed)

            return mergedUser;
          }
        }
        
        // User sync failed (logging removed)
        
        // Re-throw if it's not a uniqueness constraint error
        throw upsertError;
      }
    } catch (error) {
      // Database error in checkUser (logging removed)
      
      // Don't return temporary user - throw instead
      // This ensures we know when sync fails and can handle it properly
      // Database error - user NOT stored (logging removed)
      
      // Return null instead of temporary user to force retry
      // The calling code should handle this and retry sync
      return null;
    }
  } catch (error) {
    // If Neon Auth isn't initialized or user fetch fails, return null
    // This allows the app to render without user context
    // Neon Auth error (logging removed)
    return null;
  }
};

export const checkUser = cache(checkUserImpl);
