import { db, executeWithRetry } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generate industry insights on a schedule
 * Runs every Sunday at midnight
 */
export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ event, step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
      const prompt = `
    You are an expert labor market analyst. Analyze the latest data and trends for the "${industry}" industry in the United States as of ${new Date().getFullYear()}.
    Provide your response in STRICTLY the following JSON format, with realistic, data-driven values (no placeholders or guesses):

    {
        "salaryRanges": [
            { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
        ],
        "growthRate": number, // Percentage, e.g., 5.2
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

      const res = await step.run(`Generate insights for ${industry}`, async () => {
        return await model.generateContent(prompt);
      });

      const text = res.response.candidates[0].content.parts[0].text || "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedText);

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);

/**
 * Process new user onboarding
 * Triggered when a new user signs up
 * Sends personalized welcome content after 1 hour delay
 */
export const processNewUserOnboarding = inngest.createFunction(
  { name: "Process New User Onboarding" },
  { event: "user/created" },
  async ({ event, step }) => {
    const { userId, email, name } = event.data;

    // Wait 1 hour before sending welcome content
    await step.sleep("wait-1-hour", "1h");

    // Fetch user details from database
    const user = await step.run("Fetch user details", async () => {
      return await executeWithRetry(async () => {
        return await db.user.findUnique({
          where: { clerkUserId: userId },
          select: {
            id: true,
            name: true,
            email: true,
            industry: true,
            experience: true,
          },
        });
      });
    });

    if (!user) {
      console.warn(`User ${userId} not found in database`);
      return { success: false, reason: "User not found" };
    }

    // Generate personalized welcome message
    const welcomeMessage = await step.run("Generate welcome message", async () => {
      const prompt = `Create a personalized welcome message for ${name || email} who just signed up for LaunchTrack, an AI-powered career coaching platform. 
      
      Keep it warm, encouraging, and brief (2-3 sentences). Mention key features like resume building, cover letter generation, and interview preparation.`;

      try {
        const result = await model.generateContent(prompt);
        return result.response.candidates[0].content.parts[0].text || "";
      } catch (error) {
        console.error("Error generating welcome message:", error);
        return `Welcome to LaunchTrack, ${name || email}! We're excited to help you advance your career.`;
      }
    });

    // Log the onboarding completion
    await step.run("Log onboarding", async () => {
      console.log(`✅ New user onboarding completed for ${email}`);
      console.log(`Welcome message: ${welcomeMessage}`);
      return { success: true, userId, email };
    });

    return { success: true, userId, email, welcomeMessage };
  }
);

/**
 * Generate interview practice questions
 * Triggered when user requests interview practice
 */
export const generateInterviewQuestions = inngest.createFunction(
  { name: "Generate Interview Questions" },
  { event: "interview/practice-requested" },
  async ({ event, step }) => {
    const { userId, jobTitle, industry, experience } = event.data;

    // Fetch user details
    const user = await step.run("Fetch user", async () => {
      return await executeWithRetry(async () => {
        return await db.user.findUnique({
          where: { clerkUserId: userId },
        });
      });
    });

    if (!user) {
      return { success: false, reason: "User not found" };
    }

    // Generate interview questions using AI
    const questions = await step.run("Generate questions", async () => {
      const prompt = `Generate 5 realistic interview questions for a ${jobTitle} position in the ${industry} industry for someone with ${experience} years of experience.
      
      Format as JSON array:
      [
        { "question": "string", "category": "Technical" | "Behavioral" | "Situational", "difficulty": "Easy" | "Medium" | "Hard" }
      ]`;

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.candidates[0].content.parts[0].text || "";
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        return JSON.parse(cleanedText);
      } catch (error) {
        console.error("Error generating questions:", error);
        return [];
      }
    });

    return { success: true, userId, questions };
  }
);

/**
 * Analyze cover letter performance
 * Triggered when a cover letter is created
 */
export const analyzeCoverLetterPerformance = inngest.createFunction(
  { name: "Analyze Cover Letter Performance" },
  { event: "cover-letter/created" },
  async ({ event, step }) => {
    const { userId, coverLetterId } = event.data;

    // Fetch cover letter
    const coverLetter = await step.run("Fetch cover letter", async () => {
      return await executeWithRetry(async () => {
        return await db.coverLetter.findUnique({
          where: { id: coverLetterId },
          include: { user: true },
        });
      });
    });

    if (!coverLetter) {
      return { success: false, reason: "Cover letter not found" };
    }

    // Analyze cover letter using AI
    const analysis = await step.run("Analyze cover letter", async () => {
      const prompt = `Analyze this cover letter for a ${coverLetter.jobTitle} position at ${coverLetter.companyName}:
      
      ${coverLetter.content}
      
      Provide feedback on:
      - Strengths
      - Areas for improvement
      - ATS compatibility score (0-100)
      - Overall quality score (0-100)
      
      Format as JSON:
      {
        "strengths": ["string"],
        "improvements": ["string"],
        "atsScore": number,
        "qualityScore": number,
        "feedback": "string"
      }`;

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.candidates[0].content.parts[0].text || "";
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        return JSON.parse(cleanedText);
      } catch (error) {
        console.error("Error analyzing cover letter:", error);
        return null;
      }
    });

    // Update cover letter with analysis
    if (analysis) {
      await step.run("Update cover letter", async () => {
        return await executeWithRetry(async () => {
          return await db.coverLetter.update({
            where: { id: coverLetterId },
            data: {
              feedback: analysis.feedback,
            },
          });
        });
      });
    }

    return { success: true, coverLetterId, analysis };
  }
);