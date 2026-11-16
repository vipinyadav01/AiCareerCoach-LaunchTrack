export const dynamic = 'force-dynamic';

import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";

// The last ATS check is stored as JSON on the resume; ignore anything unreadable.
function parseAts(feedback) {
  try {
    const value = JSON.parse(feedback || "null");
    return value && typeof value.score === "number" ? value : null;
  } catch {
    return null;
  }
}

export default async function ResumePage() {
  const resume = await getResume();

  return <ResumeBuilder initialContent={resume?.content} initialAts={parseAts(resume?.feedback)} />;
}
