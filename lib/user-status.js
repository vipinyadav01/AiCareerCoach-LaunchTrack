import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Server-only utility (no "use server" pragma) for reading onboarding status
export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) return { isOnboarded: false };

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    if (!user) return { isOnboarded: false };

    return { isOnboarded: !!user.industry };
  } catch (_err) {
    // Be conservative: assume not onboarded on failures
    return { isOnboarded: false };
  }
}
