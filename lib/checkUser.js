import { cache } from "react";
import { unstable_rethrow } from "next/navigation";
import { neonAuth } from "@neondatabase/auth/next/server";
import { db, executeWithRetry } from "./prisma";

/**
 * Resolve the signed-in Neon Auth user to their database row, creating or
 * linking it when needed. Memoized per request with React cache().
 *
 * Returns null ONLY when nobody is signed in. A database or auth outage
 * throws, so callers show a retry state instead of treating the person as
 * signed out (which used to bounce them to /auth/sign-in or /onboarding).
 */
const checkUserImpl = async () => {
  const { user: neonUser } = await neonAuth();
  if (!neonUser) return null;

  const name = neonUser.name || neonUser.email?.split("@")[0] || "User";
  const email = neonUser.email;
  // Better Auth exposes the avatar as `image` (fall back to `imageUrl` for safety).
  const imageUrl = neonUser.image ?? neonUser.imageUrl ?? null;
  if (!email) return null;

  const existingUser = await executeWithRetry(() =>
    db.user.findUnique({ where: { neonUserId: neonUser.id } })
  );

  if (
    existingUser &&
    existingUser.name === name &&
    existingUser.email === email &&
    existingUser.imageUrl === imageUrl
  ) {
    return existingUser;
  }

  try {
    return await executeWithRetry(() =>
      db.user.upsert({
        where: { neonUserId: neonUser.id },
        update: { name, imageUrl, email },
        create: { neonUserId: neonUser.id, name, imageUrl, email, skills: [] },
      })
    );
  } catch (error) {
    unstable_rethrow(error);
    // Email already belongs to a row with another neonUserId (e.g. created
    // before the auth migration): link that row to this Neon Auth user.
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return executeWithRetry(() =>
        db.user.update({ where: { email }, data: { neonUserId: neonUser.id, name, imageUrl } })
      );
    }
    // A parallel request created the row between our read and write.
    if (error.code === "P2002") {
      const row = await db.user.findUnique({ where: { neonUserId: neonUser.id } });
      if (row) return row;
    }
    throw error;
  }
};

export const checkUser = cache(checkUserImpl);

/** For server actions: the signed-in user's database row, or an error. */
export async function requireDbUser() {
  const user = await checkUser();
  if (!user) throw new Error("Your session has ended. Please sign in again.");
  return user;
}
