"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { redirect } from "next/navigation";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper function to clean JSON response
const cleanJsonResponse = (text) => {
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanedText);
};

export async function checkUserAndRedirect() {
  try {
    const { userId } = await auth();
    if (!userId) {
      redirect("/sign-in");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        industry: true,
        experienceLevel: true,
        location: true,
      },
    });

    if (!user || !user.industry) {
      redirect("/onboarding");
    }

    return user;
  } catch (error) {
    redirect("/onboarding");
  }
}

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    });

    if (!user) {
      return { 
        redirect: "/onboarding", 
        message: "User not found. Please complete your onboarding." 
      };
    }

    // Check if user has completed onboarding (has industry set)
    if (!user.industry) {
      return { 
        redirect: "/onboarding", 
        message: "Please complete your onboarding to access industry insights." 
      };
    }

    // If no insights exist, generate them
    if (!user.industryInsight) {
      try {
        const insights = await generateAIInsights(user.industry);

        const industryInsight = await db.industryInsight.create({
          data: {
            industry: user.industry,
            ...insights,
            userId: user.id,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });

        return { data: industryInsight, redirect: null };
      } catch (error) {
        return { 
          redirect: "/onboarding", 
          message: "Unable to generate industry insights. Please update your profile." 
        };
      }
    }

    return { data: user.industryInsight, redirect: null };
  } catch (error) {
    // If database connection fails, redirect to onboarding
    return { 
      redirect: "/onboarding", 
      message: "Database connection failed. Please try again later." 
    };
  }
}

export const generateAIInsights = async (industry) => {
  try {
    const prompt = `
    You are an expert labor market analyst. Analyze the latest data and trends for the "${industry}" industry in the United States as of ${new Date().getFullYear()}.
    Provide your response in STRICTLY the following JSON format, with realistic, data-driven values (no placeholders or guesses):

    {
        "salaryRanges": [
            { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
        ],
        "growthRate": number,
        "demandLevel": "High" | "Medium" | "Low",
        "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
        "marketOutlook": "Positive" | "Neutral" | "Negative",
        "keyTrends": ["trend1", "trend2", "trend3", "trend4", "trend5"],
        "recommendedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"]
    }

    - Use only real, recent, and relevant information.
    - Salary ranges must include at least 5 common roles, with realistic US salary data for each.
    - Growth rate should be a recent annual percentage for the industry.
    - Demand level should reflect current hiring trends.
    - Include at least 5 top skills and 5 key trends.
    - Do NOT include any explanations, markdown, or extra text—ONLY the JSON object.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    throw new Error("Failed to generate industry insights");
  }
};
