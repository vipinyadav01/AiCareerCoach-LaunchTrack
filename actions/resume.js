"use server";

import { db } from "@/lib/prisma";
import { requireDbUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";
import { getGeminiModel } from "@/lib/gemini";

export async function saveResume(content) {
  const user = await requireDbUser();

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
  const user = await requireDbUser();

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  const { id } = await requireDbUser();
  const user = await db.user.findUnique({ where: { id }, include: { industryInsight: true } });

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
// Keep only short strings from a model-supplied list.
const cleanList = (value, max = 8) =>
  (Array.isArray(value) ? value : [])
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim().slice(0, 300))
    .slice(0, max);

/**
 * Score the resume text (the Markdown currently in the builder) for ATS
 * readiness, optionally against a job description. Saves the latest result
 * on the user's saved resume, if they have one.
 */
export async function scoreResume({ content, jobDescription } = {}) {
  const user = await requireDbUser();

  const resumeText = String(content ?? "").trim();
  if (resumeText.length < 50) throw new Error("Add more to your resume before checking it.");
  if (resumeText.length > 20000) throw new Error("Your resume is too long to check. Keep it under 20,000 characters.");
  const job = String(jobDescription ?? "").trim().slice(0, 8000);

  const prompt = `
You are an applicant tracking system (ATS) and an experienced recruiter.
Score the resume below from 0 to 100 for how well it would pass ATS screening${job ? " for the job description given" : ` for a ${user.industry || "professional"} role`}.
Judge: keyword match${job ? " with the job description" : ""}, clear standard section headings, measurable achievements, action verbs, concise bullets, and contact details. Do not reward length.

Return ONLY JSON in exactly this shape:
{"score": number, "summary": "one or two sentences", "strengths": ["..."], "improvements": ["specific, actionable fix"], "missingKeywords": ["keyword"]}
Give 2 to 5 strengths, 3 to 6 improvements, and up to 8 missing keywords${job ? " taken from the job description" : ""}.

RESUME:
"""
${resumeText}
"""
${job ? `\nJOB DESCRIPTION:\n"""\n${job}\n"""` : ""}
`;

  let parsed;
  try {
    const { client } = await getGeminiModel();
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    const text = (response.text || "").replace(/```(?:json)?\n?/g, "").trim();
    parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? text);
  } catch (error) {
    console.error("Error scoring resume:", error);
    throw new Error("Could not check your resume right now. Try again in a moment.");
  }

  const score = Math.round(Math.min(100, Math.max(0, Number(parsed?.score) || 0)));
  const result = {
    score,
    summary: typeof parsed?.summary === "string" ? parsed.summary.trim().slice(0, 600) : "",
    strengths: cleanList(parsed?.strengths, 5),
    improvements: cleanList(parsed?.improvements, 6),
    missingKeywords: cleanList(parsed?.missingKeywords, 8),
    againstJob: Boolean(job),
    checkedAt: new Date().toISOString(),
  };

  // updateMany: a no-op when the resume has not been saved yet.
  await db.resume.updateMany({
    where: { userId: user.id },
    data: { atsScore: score, feedback: JSON.stringify(result) },
  });

  return result;
}
