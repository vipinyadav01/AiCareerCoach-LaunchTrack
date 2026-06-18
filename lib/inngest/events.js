import { inngest } from "./client";

/**
 * Trigger new user onboarding workflow
 * This sends personalized welcome content and feature recommendations
 */
export async function triggerNewUserOnboarding({ id, email, name }) {
  return await inngest.send({
    name: "user/created",
    data: {
      userId: id,
      email,
      name,
    },
    // Event key is required to send events to Inngest
    ...(process.env.INNGEST_EVENT_KEY && {
      eventKey: process.env.INNGEST_EVENT_KEY,
    }),
  });
}

/**
 * Request interview practice questions generation
 */
export async function requestInterviewPractice({
  userId,
  jobTitle,
  industry,
  experience,
}) {
  return await inngest.send({
    name: "interview/practice-requested",
    data: {
      userId,
      jobTitle,
      industry,
      experience,
    },
    ...(process.env.INNGEST_EVENT_KEY && {
      eventKey: process.env.INNGEST_EVENT_KEY,
    }),
  });
}

/**
 * Trigger cover letter performance analysis
 */
export async function analyzeCoverLetter({ userId, coverLetterId }) {
  return await inngest.send({
    name: "cover-letter/created",
    data: {
      userId,
      coverLetterId,
    },
    ...(process.env.INNGEST_EVENT_KEY && {
      eventKey: process.env.INNGEST_EVENT_KEY,
    }),
  });
}
