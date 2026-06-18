import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import {
  generateIndustryInsights,
  processNewUserOnboarding,
  generateInterviewQuestions,
  analyzeCoverLetterPerformance,
} from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  // Signing key is used to verify requests from Inngest
  signingKey: process.env.INNGEST_SIGNING_KEY,
  functions: [
    generateIndustryInsights,
    processNewUserOnboarding,
    generateInterviewQuestions,
    analyzeCoverLetterPerformance,
  ],
});
