"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        // First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // If industry doesn't exist, create it with default values
        if (!industryInsight) {
          let insights = {};
          try {
            insights = await generateAIInsights(data.industry);
          } catch (error) {
            console.warn("Failed to generate AI insights, using defaults:", error.message);
            // If insight generation fails, proceed with minimal record
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

          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // Now update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 15000, // Increased timeout for AI generation
        maxWait: 20000,
      }
    );

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");
    
    return { 
      success: true, 
      user: result.updatedUser,
      message: "Profile updated successfully"
    };
  } catch (error) {
    console.error("Error updating user and industry:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update profile" 
    };
  }
}

export async function getUserOnboardingStatus() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, isOnboarded: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        industry: true,
        experience: true,
        bio: true,
        skills: true,
      },
    });

    if (!user) {
      return { success: false, isOnboarded: false, error: "User not found" };
    }

    // Consider user onboarded if they have industry set
    const isOnboarded = !!user.industry;

    return {
      success: true,
      isOnboarded,
      user: isOnboarded ? user : null,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { 
      success: false, 
      isOnboarded: false, 
      error: "Failed to check onboarding status" 
    };
  }
}
