"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackLink, FieldError, PageHeader, Panel } from "@/components/app/screen";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";

export default function CoverLetterEditor({ coverLetter }) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      jobTitle: coverLetter?.jobTitle || "",
      companyName: coverLetter?.companyName || "",
      jobDescription: coverLetter?.jobDescription || "",
      experience: coverLetter?.experience || "",
      skills: coverLetter?.skills || "",
      generatedContent: coverLetter?.generatedContent || "",
    },
  });

  const {
    loading: isUpdating,
    fn: updateCoverLetterFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateCoverLetter);

  useEffect(() => {
    if (updateResult && !isUpdating) {
      toast.success("Cover letter updated successfully!");
      router.push(`/ai-cover-letter/${coverLetter.id}`);
    }
    if (updateError) {
      toast.error(updateError.message || "Failed to update cover letter");
    }
  }, [updateResult, updateError, isUpdating, router, coverLetter.id]);

  const onSubmit = async (data) => {
    try {
      await updateCoverLetterFn(coverLetter.id, data);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const formData = watch();
      const { generateCoverLetter } = await import("@/actions/cover-letter");
      
      const result = await generateCoverLetter({
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        jobDescription: formData.jobDescription,
        experience: formData.experience,
        skills: formData.skills,
      });

      if (result.success) {
        setValue("generatedContent", result.data.generatedContent);
        toast.success("Cover letter regenerated successfully!");
      } else {
        toast.error(result.error || "Failed to regenerate cover letter");
      }
    } catch (error) {
      console.error("Regeneration error:", error);
      toast.error("Failed to regenerate cover letter");
    } finally {
      setIsGenerating(false);
    }
  };

  const field = (id, label, control) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {control}
      <FieldError error={errors[id]} />
    </div>
  );

  return (
    <>
      <BackLink href={`/ai-cover-letter/${coverLetter.id}`}>Back to letter</BackLink>
      <PageHeader
        title="Edit cover letter"
        description={`${coverLetter.jobTitle} at ${coverLetter.companyName}`}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Panel
          title="Letter"
          description="Edit the text directly, or regenerate it from the details below."
          actions={
            <Button type="button" variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {isGenerating ? "Regenerating" : "Regenerate"}
            </Button>
          }
        >
          <Label htmlFor="generatedContent" className="sr-only">Cover letter text</Label>
          <Textarea
            id="generatedContent"
            {...register("generatedContent")}
            placeholder="Your cover letter text"
            rows={18}
            className="min-h-96 text-[15px] leading-relaxed"
            aria-invalid={!!errors.generatedContent}
          />
          <FieldError error={errors.generatedContent} />
        </Panel>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Panel title="The job">
            <div className="space-y-4">
              {field("jobTitle", "Job title", <Input id="jobTitle" {...register("jobTitle")} aria-invalid={!!errors.jobTitle} />)}
              {field("companyName", "Company", <Input id="companyName" {...register("companyName")} aria-invalid={!!errors.companyName} />)}
              {field(
                "jobDescription",
                "Job description",
                <Textarea id="jobDescription" {...register("jobDescription")} rows={6} aria-invalid={!!errors.jobDescription} />
              )}
            </div>
          </Panel>

          <Panel title="About you">
            <div className="space-y-4">
              {field(
                "experience",
                "Relevant experience",
                <Textarea id="experience" {...register("experience")} rows={6} placeholder="Roles and results that fit this job" />
              )}
              {field(
                "skills",
                "Key skills",
                <Textarea id="skills" {...register("skills")} rows={4} placeholder="Skills this job asks for" />
              )}
            </div>
          </Panel>
        </div>

        <div className="sticky bottom-0 -mx-4 flex justify-end gap-2 border-t bg-background/85 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border">
          <Button type="button" variant="ghost" onClick={() => router.push(`/ai-cover-letter/${coverLetter.id}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {isUpdating ? "Saving" : "Save changes"}
          </Button>
        </div>
      </form>
    </>
  );
}
