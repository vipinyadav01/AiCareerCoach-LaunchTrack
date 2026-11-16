export const dynamic = 'force-dynamic';

import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Screen } from "@/components/app/screen";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <Screen>
      <PageHeader
        title="Cover letters"
        description="Each letter is written for one job. Paste the job description and edit the draft before you send it."
        actions={
          <Button asChild>
            <Link href="/ai-cover-letter/new">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              New cover letter
            </Link>
          </Button>
        }
      />
      <CoverLetterList coverLetters={coverLetters} />
    </Screen>
  );
}
