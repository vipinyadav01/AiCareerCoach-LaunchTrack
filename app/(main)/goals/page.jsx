export const dynamic = "force-dynamic";

import { getGoals } from "@/actions/goals";
import { PageHeader, Screen } from "@/components/app/screen";
import GoalsBoard from "./_components/goals-board";

export const metadata = { title: "Goals" };

export default async function GoalsPage() {
  const goals = await getGoals();

  return (
    <Screen>
      <PageHeader
        title="Goals"
        description="Milestones you are working towards, and the certifications you need to keep current."
      />
      <GoalsBoard goals={goals} />
    </Screen>
  );
}
