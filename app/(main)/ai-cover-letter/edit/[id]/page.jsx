import { getCoverLetterById } from "@/actions/cover-letter";
import { notFound } from "next/navigation";
import { Screen } from "@/components/app/screen";
import CoverLetterEditor from "../../_components/cover-letter-editor";

export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;

  let coverLetter = null;
  try {
    coverLetter = await getCoverLetterById(id);
  } catch (error) {
    console.error("Error fetching cover letter:", error);
  }

  if (!coverLetter) {
    notFound();
  }

  return (
    <Screen>
      <CoverLetterEditor coverLetter={coverLetter} />
    </Screen>
  );
}
