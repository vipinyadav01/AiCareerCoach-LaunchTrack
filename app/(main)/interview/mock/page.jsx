export const dynamic = 'force-dynamic';

import { BackLink, PageHeader, Screen } from "@/components/app/screen";
import Quiz from "../_components/quiz";

export default function MockInterviewPage() {
  return (
    <Screen className="max-w-3xl">
      <BackLink href="/interview">Interview practice</BackLink>
      <PageHeader title="Practice quiz" description="Questions specific to your industry and skills." />
      <Quiz />
    </Screen>
  );
}
