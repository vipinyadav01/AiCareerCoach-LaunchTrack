"use client";

import { useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, CircleAlert, Gauge, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, Panel } from "@/components/app/screen";
import { scoreResume } from "@/actions/resume";

const scoreTone = (score) =>
  score >= 75
    ? { text: "text-success", label: "Strong" }
    : score >= 50
      ? { text: "text-warning", label: "Needs work" }
      : { text: "text-destructive", label: "Likely filtered out" };

function Result({ result }) {
  const tone = scoreTone(result.score);
  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              ATS score {result.againstJob ? "for this job" : "(general check)"}
            </p>
            <p className={`tabular text-5xl font-medium tracking-[-0.03em] ${tone.text}`}>
              {result.score}
              <span className="text-2xl text-muted-foreground">/100</span>
            </p>
          </div>
          <p className={`pb-1.5 text-sm font-medium ${tone.text}`}>{tone.label}</p>
        </div>
        <Progress value={result.score} className="mt-4 h-1.5 bg-muted" aria-label="ATS score" />
        {result.summary && <p className="mt-4 max-w-3xl text-[15px] leading-relaxed">{result.summary}</p>}
        {result.checkedAt && (
          <p className="mt-2 text-sm text-muted-foreground">
            Checked {formatDistanceToNow(new Date(result.checkedAt), { addSuffix: true })}
          </p>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Fix these first">
          {result.improvements.length ? (
            <ol className="space-y-3">
              {result.improvements.map((item, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                  <CircleAlert className="mt-1 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">Nothing major to fix.</p>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel
            title="Missing keywords"
            description={result.againstJob ? "Terms from the job description your resume does not use." : "Common terms for your field that are missing."}
          >
            {result.missingKeywords.length ? (
              <ul className="flex flex-wrap gap-2">
                {result.missingKeywords.map((k) => (
                  <li key={k} className="rounded-md border border-primary/30 bg-accent px-2.5 py-1 text-sm text-accent-foreground">
                    {k}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No important keywords missing.</p>
            )}
          </Panel>

          <Panel title="What already works">
            <ul className="space-y-3">
              {result.strengths.map((item, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export default function AtsCheck({ content, initialResult }) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(initialResult || null);
  const [pending, start] = useTransition();
  const hasContent = (content || "").trim().length >= 50;

  const check = () =>
    start(async () => {
      try {
        setResult(await scoreResume({ content, jobDescription }));
      } catch (error) {
        toast.error(error.message || "Could not check your resume");
      }
    });

  return (
    <div className="space-y-6">
      <Panel
        title="Check how an ATS reads your resume"
        description="Uses the resume as it is in the builder now. Paste a job description to score it for that job, or leave it empty for a general check."
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ats-job">Job description (optional)</Label>
            <Textarea
              id="ats-job"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              maxLength={8000}
              className="min-h-36"
              placeholder="Paste the job posting here"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={check} disabled={pending || !hasContent}>
              {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              ) : (
                <Gauge className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {pending ? "Checking your resume" : jobDescription.trim() ? "Score for this job" : "Check ATS score"}
            </Button>
            {!hasContent && (
              <p className="text-sm text-muted-foreground">Fill in the form or use the template first.</p>
            )}
          </div>
        </div>
      </Panel>

      <div aria-live="polite">
        {result ? (
          <Result result={result} />
        ) : (
          <EmptyState
            title="No score yet"
            description="Your score, the fixes that matter most and missing keywords will show here."
          />
        )}
      </div>
    </div>
  );
}
