"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Panel } from "@/components/app/screen";
import QuizResult from "./quiz-result";

export default function QuizList({ assessments }) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Number quizzes in the order they were taken, list newest first.
  const rows = (assessments || []).map((a, i) => ({ ...a, number: i + 1 })).reverse();

  return (
    <>
      <Panel title="Past quizzes" description="Open one to review every question." bodyClassName="p-0">
        <ul className="divide-y">
          {rows.map((assessment) => (
            <li key={assessment.id}>
              <button
                type="button"
                onClick={() => setSelectedQuiz(assessment)}
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/60 active:bg-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="block font-medium">Quiz {assessment.number}</span>
                  {assessment.improvementTip && (
                    <span className="line-clamp-2 block text-sm text-muted-foreground">{assessment.improvementTip}</span>
                  )}
                </span>
                <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">
                  {format(new Date(assessment.createdAt), "d MMM yyyy, HH:mm")}
                </span>
                <span className="tabular w-16 shrink-0 text-right font-medium">{assessment.quizScore.toFixed(1)}%</span>
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quiz {selectedQuiz?.number}</DialogTitle>
            <DialogDescription>
              {selectedQuiz ? format(new Date(selectedQuiz.createdAt), "d MMMM yyyy, HH:mm") : ""}
            </DialogDescription>
          </DialogHeader>
          <QuizResult result={selectedQuiz} hideStartNew onStartNew={() => router.push("/interview/mock")} />
        </DialogContent>
      </Dialog>
    </>
  );
}
