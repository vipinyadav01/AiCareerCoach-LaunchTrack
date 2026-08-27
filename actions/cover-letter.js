"use server";

import { db } from "@/lib/prisma";
import { getUserId } from "@/lib/neon-auth-server";
import { getGeminiModel } from "@/lib/gemini";
import { analyzeCoverLetter } from "@/lib/inngest/events";

export async function generateCoverLetter(data) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { neonUserId: userId },
  });

  if (!user) throw new Error("User not found");

const prompt = `
    Write a professional, company-level cover letter for a ${data.jobTitle} position at ${data.companyName}.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, confident tone appropriate for corporate communication
    2. Highlight relevant skills and experience that align with company objectives
    3. Demonstrate understanding of the company's mission, values, and market position
    4. Keep it concise (max 400 words) but impactful
    5. Use proper business letter formatting in markdown
    6. Include specific, quantifiable achievements and metrics
    7. Show how the candidate's background directly addresses the company's strategic needs
    8. Emphasize leadership potential and ability to drive business results
    9. Reference industry trends and how the candidate can help the company adapt
    10. Use executive-level language and terminology
    
    Format the letter in markdown with proper business letter structure including date, recipient address, and professional closing.
`;

  try {
    const { client } = await getGeminiModel();
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const content = (response.text || "").trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    // Fire the Inngest event so the cover letter is analyzed in the background.
    // Non-blocking: a send failure must never fail cover-letter creation.
    try {
      await analyzeCoverLetter({ userId: user.id, coverLetterId: coverLetter.id });
    } catch (eventError) {
      console.warn("Inngest: failed to emit cover-letter/created:", eventError.message);
    }

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { neonUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { neonUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function getCoverLetterById(id) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { neonUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function updateCoverLetter(id, data) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { neonUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const updatedCoverLetter = await db.coverLetter.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        jobDescription: data.jobDescription,
        experience: data.experience,
        skills: data.skills,
        generatedContent: data.generatedContent,
        updatedAt: new Date(),
      },
    });

    return { success: true, data: updatedCoverLetter };
  } catch (error) {
    console.error("Error updating cover letter:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCoverLetter(id) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { neonUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}