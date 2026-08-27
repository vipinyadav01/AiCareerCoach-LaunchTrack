"use server";

import { getCurrentUser } from '@/lib/neon-auth-server';
import { db, executeWithRetry } from '@/lib/prisma';

/**
 * Explicitly sync user from Neon Auth to database
 * This ensures user data is stored immediately after signup
 * @returns {Promise<{success: boolean, user?: any, error?: string}>}
 */
export async function syncUserToDatabase() {
  try {
    const neonUser = await getCurrentUser();

    if (!neonUser) {
      return { success: false, error: 'No authenticated user found' };
    }

    if (!neonUser.email) {
      return { success: false, error: 'User has no email address' };
    }

    // Extract user information from Neon Auth.
    // Better Auth exposes the avatar as `image` (fall back to `imageUrl` for safety).
    const name = neonUser.name || neonUser.email?.split('@')[0] || 'User';
    const email = neonUser.email;
    const imageUrl = neonUser.image ?? neonUser.imageUrl ?? null;

    try {
      // Force create/update user in database
      const user = await executeWithRetry(async () => {
        return await db.user.upsert({
          where: { neonUserId: neonUser.id },
          update: {
            name,
            email,
            imageUrl,
          },
          create: {
            neonUserId: neonUser.id,
            name,
            email,
            imageUrl,
            skills: [],
          },
        });
      });

      // User synced successfully (logging removed)

      return { success: true, user };
    } catch (error) {
      // Failed to sync user (logging removed)

      // Handle email uniqueness constraint
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        // Try to find user by email and update neonUserId
        try {
          const existingUser = await executeWithRetry(async () => {
            return await db.user.findUnique({
              where: { email },
            });
          });

          if (existingUser) {
            const updatedUser = await executeWithRetry(async () => {
              return await db.user.update({
                where: { id: existingUser.id },
                data: {
                  neonUserId: neonUser.id,
                  name,
                  imageUrl,
                },
              });
            });

            // User merged by email successfully (logging removed)

            return { success: true, user: updatedUser };
          }
        } catch (mergeError) {
          // Failed to merge user by email (logging removed)
        }
      }

      return { 
        success: false, 
        error: error.message || 'Failed to sync user to database' 
      };
    }
  } catch (error) {
    // Error in syncUserToDatabase (logging removed)
    return { 
      success: false, 
      error: error.message || 'Failed to sync user' 
    };
  }
}
