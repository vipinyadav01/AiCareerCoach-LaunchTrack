export const dynamic = 'force-dynamic';

import { BackLink, PageHeader, Screen } from "@/components/app/screen";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default function NewCoverLetterPage() {
  return (
    <Screen className="max-w-3xl">
      <BackLink href="/ai-cover-letter">Cover letters</BackLink>
      <PageHeader
        title="New cover letter"
        description="We use your profile and the job description to write a first draft. You can edit everything afterwards."
      />
      <CoverLetterGenerator />
    </Screen>
  );
}
