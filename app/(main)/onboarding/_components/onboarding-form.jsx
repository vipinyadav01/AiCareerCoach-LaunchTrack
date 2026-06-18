"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  IconBriefcase,
  IconSparkles,
  IconChevronRight,
} from "@tabler/icons-react";
import { toast } from "sonner";
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

const STEPS = ["Industry", "Experience", "Skills", "Bio"];

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
  });

  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile completed successfully!");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  const watchIndustry = watch("industry");

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground mb-2">
          <IconSparkles size={22} stroke={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Set up your profile
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Tell us about yourself so we can personalize your career guidance.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm p-6 space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Industry */}
          <div className="space-y-1.5">
            <Label htmlFor="industry" className="text-sm font-medium">
              Industry
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("industry", value);
                setSelectedIndustry(industries.find((ind) => ind.id === value));
                setValue("subIndustry", "");
              }}
            >
              <SelectTrigger id="industry" className="h-10 rounded-xl border-border/60">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Industries</SelectLabel>
                  {industries.map((ind) => (
                    <SelectItem key={ind.id} value={ind.id}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-xs text-destructive mt-1">{errors.industry.message}</p>
            )}
          </div>

          {/* Specialization - shown only after industry is selected */}
          {watchIndustry && (
            <div className="space-y-1.5">
              <Label htmlFor="subIndustry" className="text-sm font-medium">
                Specialization
              </Label>
              <Select onValueChange={(value) => setValue("subIndustry", value)}>
                <SelectTrigger id="subIndustry" className="h-10 rounded-xl border-border/60">
                  <SelectValue placeholder="Select your specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Specializations</SelectLabel>
                    {selectedIndustry?.subIndustries.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.subIndustry && (
                <p className="text-xs text-destructive mt-1">{errors.subIndustry.message}</p>
              )}
            </div>
          )}

          {/* Separator */}
          <div className="h-px bg-border/40" />

          {/* Experience */}
          <div className="space-y-1.5">
            <Label htmlFor="experience" className="text-sm font-medium">
              Years of Experience
            </Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              placeholder="0"
              className="h-10 rounded-xl border-border/60"
              {...register("experience")}
            />
            {errors.experience && (
              <p className="text-xs text-destructive mt-1">{errors.experience.message}</p>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-1.5">
            <Label htmlFor="skills" className="text-sm font-medium">
              Skills
            </Label>
            <Input
              id="skills"
              placeholder="Python, JavaScript, Project Management..."
              className="h-10 rounded-xl border-border/60"
              {...register("skills")}
            />
            <p className="text-xs text-muted-foreground">Separate multiple skills with commas</p>
            {errors.skills && (
              <p className="text-xs text-destructive mt-1">{errors.skills.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-sm font-medium">
              Professional Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Briefly describe your professional background and goals..."
              className="min-h-25 rounded-xl border-border/60 resize-none"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-xs text-destructive mt-1">{errors.bio.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-10 rounded-xl font-semibold text-sm group"
            disabled={updateLoading}
          >
            {updateLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving your profile...
              </>
            ) : (
              <>
                Complete Profile
                <IconChevronRight
                  size={16}
                  className="ml-1.5 transition-transform group-hover:translate-x-0.5"
                />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        You can update these details anytime from your profile settings.
      </p>
    </div>
  );
};

export default OnboardingForm;
