import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackLink, PageHeader, Screen } from "@/components/app/screen";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

export default async function CoverLetterDetailPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  return (
    <Screen>
      <BackLink href="/ai-cover-letter">Cover letters</BackLink>
      <PageHeader
        title={coverLetter?.jobTitle || "Cover letter"}
        description={coverLetter?.companyName ? `For ${coverLetter.companyName}` : null}
        actions={
          <Button variant="outline" asChild>
            <Link href={`/ai-cover-letter/edit/${id}`}>
              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
              Edit
            </Link>
          </Button>
        }
      />
      <CoverLetterPreview content={coverLetter?.content} />
    </Screen>
  );
}
