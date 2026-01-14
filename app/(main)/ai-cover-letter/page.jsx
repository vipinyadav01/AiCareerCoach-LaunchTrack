export const dynamic = 'force-dynamic';

import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-6xl font-bold gradient-title mb-2">My Cover Letters</h1>
          <p className="text-muted-foreground text-lg">Create and manage your personalized cover letters</p>
        </div>
        <Link href="/ai-cover-letter/new">
          <Button className="group hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
            Create New
          </Button>
        </Link>
      </div>

      <div className="bg-gradient-to-r from-background to-muted/20 rounded-xl p-1">
        <div className="bg-background rounded-lg p-6 shadow-sm border">
          <CoverLetterList coverLetters={coverLetters} />
        </div>
      </div>
    </div>
  );
}