"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function QuizResult({ result, hideStartNew = false, onStartNew }) {
  if (!result) return null;

  const correct = result.questions.filter((q) => q.isCorrect).length;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="tabular text-5xl font-medium tracking-[-0.03em]">{result.quizScore.toFixed(1)}%</p>
          </div>
          <p className="tabular pb-1.5 text-sm text-muted-foreground">
            {correct} of {result.questions.length} correct
          </p>
        </div>
        <Progress value={result.quizScore} className="h-1.5 bg-muted" aria-label="Score" />
      </div>

      {result.improvementTip && (
        <div className="rounded-lg bg-accent px-4 py-3">
          <p className="text-sm font-medium text-accent-foreground">What to work on</p>
          <p className="mt-1 text-[15px] leading-relaxed">{result.improvementTip}</p>
        </div>
      )}

      <section className="space-y-3">
        <h3 className="text-base font-medium">Every question</h3>
        <ol className="divide-y border-y">
          {result.questions.map((q, index) => (
            <li key={index} className="space-y-2 py-4">
              <div className="flex items-start gap-3">
                {q.isCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-label="Correct" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-label="Incorrect" />
                )}
                <p className="font-medium leading-relaxed">{q.question}</p>
              </div>
              <dl className="space-y-1 pl-8 text-sm">
                <div className="flex gap-1.5">
                  <dt className="text-muted-foreground">Your answer:</dt>
                  <dd className={q.isCorrect ? "" : "text-destructive"}>{q.userAnswer}</dd>
                </div>
                {!q.isCorrect && (
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">Correct answer:</dt>
                    <dd className="text-success">{q.answer}</dd>
                  </div>
                )}
              </dl>
              {q.explanation && (
                <p className="pl-8 text-sm leading-relaxed text-muted-foreground">{q.explanation}</p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {!hideStartNew && (
        <Button onClick={onStartNew} className="w-full sm:w-auto">
          Take another quiz
        </Button>
      )}
    </div>
  );
}
