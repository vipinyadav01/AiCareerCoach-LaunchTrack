"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/app/screen";
import { deleteCoverLetter } from "@/actions/cover-letter";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  if (!coverLetters?.length) {
    return (
      <EmptyState
        title="No cover letters yet"
        description="Start with a job you want. Paste its description and you will have a first draft to edit in under a minute."
        action={
          <Button asChild>
            <Link href="/ai-cover-letter/new">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Write your first letter
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="divide-y rounded-xl border bg-card">
      {coverLetters.map((letter) => (
        <li key={letter.id} className="group relative flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/60">
          <div className="min-w-0 flex-1 space-y-1">
            <Link
              href={`/ai-cover-letter/${letter.id}`}
              className="font-medium after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring"
            >
              {letter.jobTitle}
              <span className="font-normal text-muted-foreground"> at {letter.companyName}</span>
            </Link>
            {letter.jobDescription && (
              <p className="line-clamp-2 max-w-3xl text-sm text-muted-foreground">{letter.jobDescription}</p>
            )}
          </div>
          <span className="tabular hidden shrink-0 pt-0.5 text-sm text-muted-foreground sm:block">
            {formatDate(letter.createdAt)}
          </span>
          <div className="relative z-10 flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/ai-cover-letter/edit/${letter.id}`)}
              aria-label={`Edit ${letter.jobTitle} at ${letter.companyName}`}
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Delete ${letter.jobTitle} at ${letter.companyName}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this cover letter?</AlertDialogTitle>
                  <AlertDialogDescription>
                    The letter for {letter.jobTitle} at {letter.companyName} will be deleted for good. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep it</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(letter.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </li>
      ))}
    </ul>
  );
}
