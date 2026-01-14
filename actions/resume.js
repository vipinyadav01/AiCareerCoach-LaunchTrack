"use server";

import { db } from "@/lib/prisma";
import { getUserId } from "@/lib/neon-auth-server";
import { revalidatePath } from "next/cache";
import { getGeminiModel } from "@/lib/gemini";

export async function saveResume(content) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { neonUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { neonUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { neonUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry || 'professional'} role.
    ${user.industryInsight ? `Consider these industry insights: ${user.industryInsight.keySkills}, ${user.industryInsight.trends}` : ''}
    Make it more impactful, quantifiable, and aligned with current industry standards.
    
    Current content: "${current}"

    Requirements:
    1. Use strong action verbs and power words
    2. Include specific metrics, percentages, or quantifiable results
    3. Highlight relevant technical skills and tools
    4. Keep it concise but comprehensive (2-3 lines maximum)
    5. Focus on achievements and impact over daily responsibilities
    6. Use current industry-specific keywords and terminology
    7. Ensure ATS (Applicant Tracking System) compatibility
    
    Return only the improved content as a single, well-formatted paragraph without any additional commentary, explanations, or formatting markers.
`;

  try {
    const { client } = await getGeminiModel();
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const improvedContent = (response.text || "").trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}