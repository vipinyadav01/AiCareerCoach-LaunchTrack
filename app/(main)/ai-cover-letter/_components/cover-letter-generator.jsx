"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/app/screen";
import { generateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";

export default function CoverLetterGenerator() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const {
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  useEffect(() => {
    if (generatedLetter) {
      toast.success("Cover letter ready");
      router.push(`/ai-cover-letter/${generatedLetter.id}`);
      reset();
    }
  }, [generatedLetter]);

  const onSubmit = async (data) => {
    try {
      await generateLetterFn(data);
    } catch (error) {
      toast.error(error.message || "Failed to generate cover letter");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-busy={generating}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company</Label>
          <Input id="companyName" placeholder="Acme Corp" aria-invalid={!!errors.companyName} {...register("companyName")} />
          <FieldError error={errors.companyName} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">Job title</Label>
          <Input id="jobTitle" placeholder="Frontend Engineer" aria-invalid={!!errors.jobTitle} {...register("jobTitle")} />
          <FieldError error={errors.jobTitle} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="jobDescription">Job description</Label>
        <Textarea
          id="jobDescription"
          placeholder="Paste the full job posting here"
          className="min-h-56"
          aria-invalid={!!errors.jobDescription}
          {...register("jobDescription")}
        />
        <p className="text-sm text-muted-foreground">The more of the posting you paste, the more specific the letter.</p>
        <FieldError error={errors.jobDescription} />
      </div>

      <div className="flex justify-end border-t pt-5">
        <Button type="submit" disabled={generating}>
          {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          {generating ? "Writing your letter" : "Write cover letter"}
        </Button>
      </div>
    </form>
  );
}
