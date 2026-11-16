"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/app/screen";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, Plus, X, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);

    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  // Replace handleImproveDescription with this
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
    });
  };

  const idp = `entry-${type.toLowerCase()}`;
  const label = type.toLowerCase();

  return (
    <div className="space-y-3">
      {entries.length > 0 && (
        <ul className="divide-y border-y">
          {entries.map((item, index) => (
            <li key={index} className="flex items-start gap-3 py-3.5">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-medium">
                  {item.title}
                  <span className="font-normal text-muted-foreground">, {item.organization}</span>
                </p>
                <p className="tabular text-sm text-muted-foreground">
                  {item.startDate} to {item.current ? "present" : item.endDate}
                </p>
                {item.description && (
                  <p className="whitespace-pre-wrap pt-1 text-sm leading-relaxed">{item.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
                aria-label={`Remove ${item.title}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {isAdding ? (
        <div className="space-y-4 rounded-lg bg-muted p-4">
          <p className="font-medium">New {label}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`${idp}-title`}>{type === "Education" ? "Degree or course" : "Title"}</Label>
              <Input id={`${idp}-title`} className="bg-card" aria-invalid={!!errors.title} {...register("title")} />
              <FieldError error={errors.title} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${idp}-org`}>{type === "Education" ? "Institution" : "Organization"}</Label>
              <Input id={`${idp}-org`} className="bg-card" aria-invalid={!!errors.organization} {...register("organization")} />
              <FieldError error={errors.organization} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${idp}-start`}>Start</Label>
              <Input id={`${idp}-start`} type="month" className="bg-card" aria-invalid={!!errors.startDate} {...register("startDate")} />
              <FieldError error={errors.startDate} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${idp}-end`}>End</Label>
              <Input
                id={`${idp}-end`}
                type="month"
                className="bg-card"
                disabled={current}
                aria-invalid={!!errors.endDate}
                {...register("endDate")}
              />
              <FieldError error={errors.endDate} />
            </div>
          </div>

          <label htmlFor={`${idp}-current`} className="flex w-fit cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              id={`${idp}-current`}
              className="h-4 w-4 accent-primary"
              {...register("current")}
              onChange={(e) => {
                setValue("current", e.target.checked);
                if (e.target.checked) {
                  setValue("endDate", "");
                }
              }}
            />
            I am here now
          </label>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`${idp}-desc`}>Description</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleImproveDescription}
                disabled={isImproving || !watch("description")}
              >
                {isImproving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {isImproving ? "Improving" : "Improve with AI"}
              </Button>
            </div>
            <Textarea
              id={`${idp}-desc`}
              className="min-h-28 bg-card"
              placeholder={`What you did and what changed because of it`}
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            <FieldError error={errors.description} />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              Add {label}
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add {label}
        </Button>
      )}
    </div>
  );
}
