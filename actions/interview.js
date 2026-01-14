"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getGeminiModel } from "@/lib/gemini";

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

   try {
  const prompt = `
  Generate 10 high-quality technical interview questions for a ${user.industry} professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.

  Requirements:
  - Questions should range from intermediate to advanced difficulty
  - Focus on practical, real-world scenarios and problem-solving
  - Include a mix of conceptual knowledge, best practices, and technical implementation
  - Each question should be multiple choice with 4 realistic options
  - Avoid overly basic or trivial questions
  - Ensure incorrect options (wrong answers) are plausible but clearly incorrect

  Return the response in this exact JSON format only, no additional text:
  {
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": "string (must exactly match one of the options)",
        "explanation": "string (brief explanation of why this answer is correct and why others are wrong)",
        "difficulty": "intermediate|advanced"
      }
    ]
  }

  Make sure the correctAnswer field exactly matches one of the provided options.
  `;

    const { client } = await getGeminiModel();
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text || "";
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");


  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
  let improvementTip = null;

  // Only generate improvement tips if there are wrong answers
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user is a ${user.industry} professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
      } who answered the following technical interview questions incorrectly:

      ${wrongQuestionsText}

      Based on these specific incorrect answers, provide a highly targeted improvement recommendation.
      Analyze the exact knowledge gaps and misconceptions demonstrated by comparing their wrong answers to the correct ones.
      Focus on the specific technical concepts, frameworks, or best practices they need to study.
      Keep the response under 3 sentences, be encouraging but precise about what to learn.
      Don't just mention the mistakes - provide actionable learning direction based on the error patterns.
    `;

    try {
      const { client } = await getGeminiModel();
      const response = await client.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: improvementPrompt,
      });
      improvementTip = (response.text || "").trim();


      
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      improvementTip = "Review the questions you got wrong to improve your skills.";
      
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const {userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");


  try {
    const assessments =  await db.assessment.findMany({
      where: {userId: user.id},
      orderBy: { createdAt: "asc" },

    })
    return assessments;
    
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
