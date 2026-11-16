import { Stat, StatStrip } from "@/components/app/screen";

// Assessments arrive oldest first (getAssessments orders by createdAt asc).
export default function StatsCards({ assessments }) {
  const list = assessments || [];
  const average = list.length
    ? list.reduce((sum, a) => sum + a.quizScore, 0) / list.length
    : 0;
  const totalQuestions = list.reduce((sum, a) => sum + (a.questions?.length || 0), 0);
  const latest = list.at(-1);

  return (
    <StatStrip>
      <Stat label="Average score" value={`${average.toFixed(1)}%`} note={`Across ${list.length} ${list.length === 1 ? "quiz" : "quizzes"}`} />
      <Stat label="Latest score" value={`${(latest?.quizScore ?? 0).toFixed(1)}%`} note="Most recent quiz" />
      <Stat label="Questions answered" value={totalQuestions} note="All time" />
    </StatStrip>
  );
}
