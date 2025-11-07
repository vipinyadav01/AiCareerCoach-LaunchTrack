import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_components/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      redirect("/sign-in");
    }
    const { isOnboarded } = await getUserOnboardingStatus();

    if (!isOnboarded) {
      redirect("/onboarding");
    }

    const insights = await getIndustryInsights();

    if (insights?.redirect) {
      redirect(insights.redirect);
    }
    const dashboardData = insights?.data || insights;
    
    if (!dashboardData || !dashboardData.salaryRanges || !dashboardData.industry) {
      redirect("/onboarding");
    }

    return (
      <div className="container mx-auto">
        <DashboardView insights={dashboardData} />
      </div>
    );
  } catch (error) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
        redirect("/onboarding");
  }
}