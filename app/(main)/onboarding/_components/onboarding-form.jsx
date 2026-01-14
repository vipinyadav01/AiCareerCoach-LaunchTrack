"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Building2, Briefcase, Award, Code, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { onboardingSchema } from "@/app/lib/schema";
import { updateUser } from "@/actions/user";

const OnboardingForm = ({ industries }) => {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: "",
      subIndustry: "",
      experience: "0",
      skills: "",
      bio: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      console.log("Form values:", values); // Debug log

      // Ensure subIndustry exists before using it
      const formattedIndustry = values.subIndustry
        ? `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`
        : values.industry;

      const result = await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });

      console.log("Update result:", result); // Debug log

      // Check if there was an error in the result
      if (result?.error || !result?.success) {
        toast.error(result?.error || "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error(error?.message || "Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    if (updateResult && !updateLoading) {
      if (updateResult.success) {
        toast.success(updateResult.message || "Profile completed successfully!");
        router.push("/dashboard");
        router.refresh();
      } else if (updateResult.error) {
        toast.error(updateResult.error);
      }
    }
  }, [updateResult, updateLoading, router]);

  const watchIndustry = watch("industry");
  const watchExperience = watch("experience");
  const watchSkills = watch("skills");
  const watchBio = watch("bio");

  // Calculate progress (only required fields: industry, experience, skills)
  const requiredFields = [
    watchIndustry ? 1 : 0,
    watchExperience ? 1 : 0,
    watchSkills ? 1 : 0,
  ];
  const progress = (requiredFields.reduce((a, b) => a + b, 0) / 3) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-muted-foreground">Profile Completion</h2>
          <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card className="border-2 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Help us personalize your career journey with tailored insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-base font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Industry
              </Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value)
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry" className="h-12 text-base">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id} className="py-2">
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <span>⚠</span>
                  {errors.industry.message}
                </p>
              )}
            </div>

            {watchIndustry && selectedIndustry && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="subIndustry" className="text-base font-semibold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Specialization
                  <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger id="subIndustry" className="h-12 text-base">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectGroup>
                      <SelectLabel>Specializations</SelectLabel>
                      {selectedIndustry?.subIndustries.map((sub) => (
                        <SelectItem key={sub} value={sub} className="py-2">
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                    <span>⚠</span>
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-base font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Years of Experience
              </Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="e.g., 5"
                className="h-12 text-base"
                {...register("experience")}
              />
              <p className="text-sm text-muted-foreground">
                Enter your total years of professional experience
              </p>
              {errors.experience && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <span>⚠</span>
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-base font-semibold flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                Skills
              </Label>
              <Input
                id="skills"
                placeholder="e.g., Python, JavaScript, Project Management, Leadership"
                className="h-12 text-base"
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                List your key skills separated by commas
              </p>
              {errors.skills && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <span>⚠</span>
                  {errors.skills.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Professional Bio
                <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background, achievements, and career goals..."
                className="h-32 text-base resize-none"
                {...register("bio")}
              />
              <p className="text-sm text-muted-foreground">
                Share your professional story to help us provide better recommendations
              </p>
              {errors.bio && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <span>⚠</span>
                  {errors.bio.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={updateLoading || !watchIndustry}
            >
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Your Profile...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Complete Profile
                </>
              )}
            </Button>

            {!watchIndustry && (
              <p className="text-sm text-center text-muted-foreground">
                Please select an industry to continue
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;