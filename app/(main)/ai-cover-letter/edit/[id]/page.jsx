import { getCoverLetterById } from "@/actions/cover-letter";
import { notFound } from "next/navigation";
import CoverLetterEditor from "../../_components/cover-letter-editor";

export default async function EditCoverLetterPage({ params }) {
  const { id } = params;
  
  try {
    const coverLetter = await getCoverLetterById(id);
    
    if (!coverLetter) {
      notFound();
    }

    return (
      <div className="container mx-auto py-8">
        <CoverLetterEditor coverLetter={coverLetter} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching cover letter:", error);
    notFound();
  }
}
