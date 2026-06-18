"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Cover Letter</h1>
            <p className="text-muted-foreground">
              Update your cover letter details
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Job Details</span>
              </CardTitle>
              <CardDescription>
                Update the job information for your cover letter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  {...register("jobTitle")}
                  placeholder="e.g., Software Engineer"
                />
                {errors.jobTitle && (
                  <p className="text-sm text-red-500">{errors.jobTitle.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  {...register("companyName")}
                  placeholder="e.g., Tech Corp"
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">{errors.companyName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  {...register("jobDescription")}
                  placeholder="Paste the job description here..."
                  rows={6}
                />
                {errors.jobDescription && (
                  <p className="text-sm text-red-500">{errors.jobDescription.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                Update your experience and skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Relevant Experience</Label>
                <Textarea
                  id="experience"
                  {...register("experience")}
                  placeholder="Describe your relevant work experience..."
                  rows={6}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Key Skills</Label>
                <Textarea
                  id="skills"
                  {...register("skills")}
                  placeholder="List your key skills relevant to this job..."
                  rows={4}
                />
                {errors.skills && (
                  <p className="text-sm text-red-500">{errors.skills.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Cover Letter</CardTitle>
                <CardDescription>
                  Review and edit your AI-generated cover letter
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleRegenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  "Regenerate"
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="generatedContent">Cover Letter Content</Label>
              <Textarea
                id="generatedContent"
                {...register("generatedContent")}
                placeholder="Your generated cover letter will appear here..."
                rows={15}
                className="font-mono text-sm"
              />
              {errors.generatedContent && (
                <p className="text-sm text-red-500">{errors.generatedContent.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/ai-cover-letter/${coverLetter.id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Cover Letter
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
