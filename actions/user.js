"use server";

import { db, executeWithRetry } from "@/lib/prisma";
import { getUserId } from "@/lib/neon-auth-server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";
import { cache } from "react";

export async function updateUser(data) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await executeWithRetry(async () => {
      return await db.user.findUnique({
        where: { neonUserId: userId },
      });
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // The user.industry column is a foreign key to IndustryInsight.industry, so
    // the matching insight row must exist before we set it on the user.
    let industryInsight = await executeWithRetry(async () => {
      return await db.industryInsight.findUnique({
        where: { industry: data.industry },
      });
    });

    // If it doesn't exist yet, generate insights with the AI model FIRST —
    // deliberately OUTSIDE any transaction so a slow/failed AI call never holds
    // a database connection (which previously caused pool timeouts and made
    // onboarding hang or fail).
    if (!industryInsight) {
      let insights;
      try {
        insights = await generateAIInsights(data.industry);
      } catch (error) {
        console.warn("Failed to generate AI insights, using defaults:", error.message);
        insights = {
          salaryRanges: [],
          growthRate: 0,
          demandLevel: "Unknown",
          topSkills: [],
          marketOutlook: "Neutral",
          keyTrends: [],
          recommendedSkills: [],
        };
      }

      // upsert (not create) so two people onboarding into the same industry at
      // once can't collide on the unique `industry` constraint.
      industryInsight = await executeWithRetry(async () => {
        return await db.industryInsight.upsert({
          where: { industry: data.industry },
          update: {},
          create: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }

    // Now the quick user write (single statement — no long-held transaction).
    const updatedUser = await executeWithRetry(async () => {
      return await db.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");

    return {
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Error updating user and industry:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update profile" 
    };
  }
}

const getUserOnboardingStatusImpl = async () => {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return { success: false, isOnboarded: false, error: "Unauthorized" };
    }

    const user = await executeWithRetry(async () => {
      return await db.user.findUnique({
        where: { neonUserId: userId },
        select: {
          id: true,
          industry: true,
          experience: true,
          bio: true,
          skills: true,
        },
      });
    });

    if (!user) {
      return { success: false, isOnboarded: false, error: "User not found" };
    }

    // Check if user has completed onboarding by validating all required fields
    // Required fields: industry, experience, skills
    // Optional fields: bio
    const hasIndustry = !!user.industry && user.industry.trim().length > 0;
    const hasExperience = user.experience !== null && user.experience !== undefined;
    const hasSkills = Array.isArray(user.skills) && user.skills.length > 0;
    
    // User is considered onboarded only if all required fields are present
    const isOnboarded = hasIndustry && hasExperience && hasSkills;

    return {
      success: true,
      isOnboarded,
      user: isOnboarded ? user : null,
      missingFields: isOnboarded ? [] : [
        !hasIndustry && 'industry',
        !hasExperience && 'experience',
        !hasSkills && 'skills'
      ].filter(Boolean),
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    
    // If database is unreachable, return a graceful fallback
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      console.warn("Database server unreachable - this may be a Neon cold start. User will need to complete onboarding.");
      return { 
        success: false, 
        isOnboarded: false, 
        error: "Database temporarily unavailable. Please try again in a moment." 
      };
    }
    
    return { 
      success: false, 
      isOnboarded: false, 
      error: "Failed to check onboarding status" 
    };
  }
};

// Cache the onboarding status check within a request to prevent duplicate calls
export const getUserOnboardingStatus = cache(getUserOnboardingStatusImpl);
