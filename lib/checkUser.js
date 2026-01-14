import { currentUser } from "@clerk/nextjs/server";
import { db, executeWithRetry } from "./prisma";

/**
 * Check and sync user from Clerk to Prisma database
 * Falls back gracefully if database is unavailable
 * 
 * Note: Caching is handled at the page/component level using Next.js cache
 * This function always performs a sync to ensure data consistency
 */
export const checkUser = async () => {
  const startTime = Date.now();
  
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    try {
      // Extract user information from Clerk
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const name = `${firstName} ${lastName}`.trim() || user.username || 'User';
      const email = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress;

      if (!email) {
        console.warn('User has no email address', { clerkUserId: user.id });
        return null;
      }

      // Use upsert to handle create/update in a single atomic operation
      // This reduces connection pool usage and prevents race conditions
      try {
        const loggedInUser = await executeWithRetry(async () => {
          return await db.user.upsert({
            where: { clerkUserId: user.id },
            update: {
              name,
              imageUrl: user.imageUrl || null,
              email,
              // Update timestamps are handled automatically by Prisma
            },
            create: {
              clerkUserId: user.id,
              name,
              imageUrl: user.imageUrl || null,
              email,
              // Initialize empty arrays for skills
              skills: [],
            },
          });
        });

        // Log successful sync
        const duration = Date.now() - startTime;
        console.log('User synced successfully', {
          clerkUserId: user.id,
          email,
          duration: `${duration}ms`,
        });

        return loggedInUser;
      } catch (upsertError) {
        // Handle case where email already exists with different clerkUserId
        // This can happen if a user was created directly in the DB or via webhook
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
            // Update the existing user's clerkUserId and other fields
            const mergedUser = await executeWithRetry(async () => {
              return await db.user.update({
                where: { id: existingUserByEmail.id },
                data: {
                  clerkUserId: user.id,
                  name,
                  imageUrl: user.imageUrl,
                },
              });
            });

            console.log('User merged by email', {
              clerkUserId: user.id,
              email,
              existingUserId: existingUserByEmail.id,
            });

            return mergedUser;
          }
        }
        
        // Log error before re-throwing
        const duration = Date.now() - startTime;
        console.error('User sync failed', {
          clerkUserId: user.id,
          email,
          error: upsertError.message,
          code: upsertError.code,
          duration: `${duration}ms`,
        });
        
        // Re-throw if it's not a uniqueness constraint error
        throw upsertError;
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('Database error in checkUser', {
        clerkUserId: user?.id,
        error: error.message,
        code: error.code,
        duration: `${duration}ms`,
      });
      
      // Return a temporary user object to allow the app to function
      // even if database is unreachable
      return {
        clerkUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
        industry: null, // Will need to complete onboarding
        isTemporary: true, // Flag to indicate this is not from DB
      };
    }
  } catch (error) {
    // If Clerk isn't initialized or user fetch fails, return null
    // This allows the app to render without user context
    const duration = Date.now() - startTime;
    console.warn('Clerk auth error in checkUser', {
      error: error.message,
      duration: `${duration}ms`,
    });
    return null;
  }
};
