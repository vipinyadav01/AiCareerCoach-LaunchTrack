"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { LogoMark } from "@/components/logo";
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
      toast.success("Profile completed");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  const watchIndustry = watch("industry");
  const labelCls = "text-[13px] font-medium text-foreground";
  const errCls = "mt-1 text-[12px] text-destructive";
  const fieldCls =
    "h-11 rounded-[8px] border-input bg-card text-foreground focus-visible:ring-ring/30";

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <LogoMark size={40} />
        <div className="space-y-1.5">
          <h1 className="font-heading text-[28px] font-medium tracking-[-0.02em] text-foreground">
            Set up your profile
          </h1>
          <p className="mx-auto max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Tell us about yourself so we can personalize your career guidance.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Industry */}
          <div className="space-y-1.5">
            <Label htmlFor="industry" className={labelCls}>Industry</Label>
            <Select
              onValueChange={(value) => {
                setValue("industry", value, { shouldValidate: true });
                setSelectedIndustry(industries.find((ind) => ind.id === value));
                setValue("subIndustry", "");
              }}
            >
              <SelectTrigger id="industry" className={fieldCls}>
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
            {errors.industry && <p role="alert" className={errCls}>{errors.industry.message}</p>}
          </div>

          {/* Specialization */}
          {watchIndustry && (
            <div className="space-y-1.5">
              <Label htmlFor="subIndustry" className={labelCls}>Specialization</Label>
              <Select onValueChange={(value) => setValue("subIndustry", value, { shouldValidate: true })}>
                <SelectTrigger id="subIndustry" className={fieldCls}>
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
              {errors.subIndustry && <p role="alert" className={errCls}>{errors.subIndustry.message}</p>}
            </div>
          )}

          <div className="h-px bg-border" />

          {/* Experience */}
          <div className="space-y-1.5">
            <Label htmlFor="experience" className={labelCls}>Years of experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              placeholder="e.g. 3"
              className={fieldCls}
              {...register("experience")}
            />
            {errors.experience && <p role="alert" className={errCls}>{errors.experience.message}</p>}
          </div>

          {/* Skills */}
          <div className="space-y-1.5">
            <Label htmlFor="skills" className={labelCls}>Skills</Label>
            <Input
              id="skills"
              placeholder="Python, JavaScript, Project Management…"
              className={fieldCls}
              {...register("skills")}
            />
            <p className="text-[12px] text-muted-foreground">Separate multiple skills with commas.</p>
            {errors.skills && <p role="alert" className={errCls}>{errors.skills.message}</p>}
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="bio" className={labelCls}>Professional bio</Label>
            <Textarea
              id="bio"
              placeholder="Briefly describe your professional background and goals…"
              className="min-h-24 rounded-[8px] border-input bg-card text-foreground resize-none focus-visible:ring-ring/30"
              {...register("bio")}
            />
            {errors.bio && <p role="alert" className={errCls}>{errors.bio.message}</p>}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="group h-11 w-full rounded-[8px] text-[15px] font-medium"
            disabled={updateLoading}
          >
            {updateLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving your profile…
              </>
            ) : (
              "Complete profile"
            )}
          </Button>
        </form>
      </div>

      <p className="mt-4 text-center text-[12px] text-muted-foreground">
        You can update these details anytime from your profile settings.
      </p>
    </div>
  );
};

export default OnboardingForm;
