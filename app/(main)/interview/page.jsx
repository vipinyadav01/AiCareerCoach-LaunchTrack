export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getAssessments } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, Screen } from "@/components/app/screen";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();
  const hasAssessments = assessments?.length > 0;

  return (
    <Screen>
      <PageHeader
        title="Interview practice"
        description="Ten questions at a time, built from your industry and skills. Every answer comes with an explanation."
        actions={
          <Button asChild>
            <Link href="/interview/mock">Start a quiz</Link>
          </Button>
        }
      />

      {hasAssessments ? (
        <div className="space-y-6">
          <StatsCards assessments={assessments} />
          <PerformanceChart assessments={assessments} />
          <QuizList assessments={assessments} />
        </div>
      ) : (
        <EmptyState
          title="No quizzes taken yet"
          description="Your scores, a trend line and every past quiz show up here once you finish your first one."
          action={
            <Button asChild>
              <Link href="/interview/mock">Take your first quiz</Link>
            </Button>
          }
        />
      )}
    </Screen>
  );
}
