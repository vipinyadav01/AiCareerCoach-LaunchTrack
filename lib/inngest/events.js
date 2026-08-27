import { inngest } from "./client";

/**
 * Thin event emitters. The event key is configured on the client (via
 * INNGEST_EVENT_KEY), so `send()` only carries the event name + data — never an
 * `eventKey` field, which is not a valid send option.
 */

/**
 * Trigger new-user onboarding (welcome content, feature recommendations).
 * @param {{ id: string, email: string, name?: string }} user
 */
export async function triggerNewUserOnboarding({ id, email, name }) {
  return await inngest.send({
    name: "user/created",
    data: { userId: id, email, name },
  });
}

/**
 * Request generation of interview practice questions.
 */
export async function requestInterviewPractice({ userId, jobTitle, industry, experience }) {
  return await inngest.send({
    name: "interview/practice-requested",
    data: { userId, jobTitle, industry, experience },
  });
}

/**
 * Trigger AI analysis of a newly created cover letter.
 */
export async function analyzeCoverLetter({ userId, coverLetterId }) {
  return await inngest.send({
    name: "cover-letter/created",
    data: { userId, coverLetterId },
  });
}
