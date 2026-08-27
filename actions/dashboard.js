"use server";

import { db, executeWithRetry } from "@/lib/prisma";
import { getUserId } from "@/lib/neon-auth-server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getGeminiModel } from "@/lib/gemini";

// Helper function to clean JSON response
const cleanJsonResponse = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error("Invalid response text");
  }
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  // Try to extract JSON if there's extra text
  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return JSON.parse(cleanedText);
};

// Validate AI insights structure
const validateInsights = (insights) => {
  if (!insights || typeof insights !== 'object') {
    throw new Error("Invalid insights structure");
  }

  const requiredFields = ['salaryRanges', 'growthRate', 'demandLevel', 'topSkills', 'marketOutlook', 'keyTrends', 'recommendedSkills'];
  for (const field of requiredFields) {
    if (!(field in insights)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate salaryRanges
  if (!Array.isArray(insights.salaryRanges) || insights.salaryRanges.length === 0) {
    throw new Error("salaryRanges must be a non-empty array");
  }

  // Validate arrays
  if (!Array.isArray(insights.topSkills) || insights.topSkills.length === 0) {
    throw new Error("topSkills must be a non-empty array");
  }
  if (!Array.isArray(insights.keyTrends) || insights.keyTrends.length === 0) {
    throw new Error("keyTrends must be a non-empty array");
  }
  if (!Array.isArray(insights.recommendedSkills) || insights.recommendedSkills.length === 0) {
    throw new Error("recommendedSkills must be a non-empty array");
  }

  // Validate types
  if (typeof insights.growthRate !== 'number' || isNaN(insights.growthRate)) {
    throw new Error("growthRate must be a number");
  }

  const validDemandLevels = ['High', 'Medium', 'Low'];
  if (!validDemandLevels.includes(insights.demandLevel)) {
    throw new Error(`demandLevel must be one of: ${validDemandLevels.join(', ')}`);
  }

  const validOutlooks = ['Positive', 'Neutral', 'Negative'];
  if (!validOutlooks.includes(insights.marketOutlook)) {
    throw new Error(`marketOutlook must be one of: ${validOutlooks.join(', ')}`);
  }

  return true;
};

export async function checkUserAndRedirect() {
  try {
    const userId = await getUserId();
    if (!userId) {
      redirect("/auth/sign-in");
    }

    const user = await executeWithRetry(async () => {
      return await db.user.findUnique({
        where: { neonUserId: userId },
        select: {
          industry: true,
          experience: true,
        },
      });
    });

    if (!user || !user.industry) {
      redirect("/onboarding");
    }

    return user;
  } catch (error) {
    redirect("/onboarding");
  }
}

// Cache the insights fetch within a request to prevent duplicate calls
const getIndustryInsightsImpl = async () => {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await executeWithRetry(async () => {
      return await db.user.findUnique({
        where: { neonUserId: userId },
        include: {
          industryInsight: true,
        },
      });
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

        // Validate insights before saving
        validateInsights(insights);

        const industryInsight = await executeWithRetry(async () => {
          return await db.industryInsight.create({
            data: {
              industry: user.industry,
              ...insights,
              lastUpdated: new Date(),
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        });

        return { data: industryInsight, redirect: null };
      } catch (error) {
        console.error("Error generating insights:", error);
        // Don't redirect - return empty/default data instead to prevent loops
        // This allows the dashboard to render with empty state
        return { 
          data: {
            industry: user.industry,
            salaryRanges: [],
            growthRate: 0,
            demandLevel: "Medium",
            topSkills: [],
            marketOutlook: "Neutral",
            keyTrends: [],
            recommendedSkills: [],
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          redirect: null,
          warning: `Unable to generate AI insights: ${error.message}. Using default values.`
        };
      }
    }

    return { data: user.industryInsight, redirect: null };
  } catch (error) {
    // If database connection fails, don't redirect - return error data
    console.error("Database error in getIndustryInsights:", error);
    return { 
      redirect: null,
      data: null,
      error: "Database connection failed. Please try again later."
    };
  }
};

// Export the cached version
const cachedGetIndustryInsights = cache(getIndustryInsightsImpl);
export async function getIndustryInsights() {
  return await cachedGetIndustryInsights();
}

export const generateAIInsights = async (industry) => {
  if (!industry || typeof industry !== 'string' || industry.trim().length === 0) {
    throw new Error("Industry is required to generate insights");
  }

  // Get client instance
  let aiClient;
  try {
    const modelData = await getGeminiModel();
    aiClient = modelData.client;
  } catch (error) {
    throw new Error("AI service is not configured. GEMINI_API_KEY is missing or invalid.");
  }

  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const prompt = `You are an expert labor market analyst. Analyze the latest data and trends for the "${industry}" industry in the United States as of ${new Date().getFullYear()}.
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

Requirements:
- Use only real, recent, and relevant information.
- Salary ranges must include at least 5 common roles, with realistic US salary data for each.
- Growth rate should be a recent annual percentage for the industry (0-100).
- Demand level must be exactly one of: "High", "Medium", or "Low".
- Market outlook must be exactly one of: "Positive", "Neutral", or "Negative".
- Include at least 5 top skills and 5 key trends.
- Do NOT include any explanations, markdown formatting, or extra text—ONLY the JSON object.
- Ensure all string values are properly escaped and all numbers are valid.
- Return valid JSON that can be parsed directly.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      if (!response) {
        throw new Error("Empty response from AI model");
      }

      const text = response.text || "";
      
      if (!text || text.trim().length === 0) {
        throw new Error("Empty text response from AI model");
      }

      // Clean and parse JSON
      const insights = cleanJsonResponse(text);
      
      // Validate the structure
      validateInsights(insights);
      
      return insights;
    } catch (error) {
      lastError = error;
      console.error(`AI generation attempt ${attempt} failed:`, error.message);
      
      // If it's a JSON parsing error and we have retries left, try again
      if (attempt < maxRetries && (error.message.includes('JSON') || error.message.includes('parse'))) {
        // Wait a bit before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      
      // If it's not a parsing error or we're out of retries, throw
      if (attempt === maxRetries || !error.message.includes('JSON')) {
        throw new Error(`Failed to generate industry insights: ${error.message}`);
      }
    }
  }

  throw new Error(`Failed to generate industry insights after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
};
