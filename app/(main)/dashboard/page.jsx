import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_components/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { checkUser } from "@/lib/checkUser";
import { cache } from "react";

// Cache the onboarding check within a request to prevent duplicate calls
const getCachedOnboardingStatus = cache(getUserOnboardingStatus);

// Use dynamic rendering but allow caching within the request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  try {
    // Ensure user exists in DB and clerkUserId is synced
    // checkUser is already cached with React cache
    const user = await checkUser();

    if (!user) {
      redirect("/sign-in");
    }

    // Now check onboarding status (after ensuring clerkUserId is synced)
    // Use cached version to prevent duplicate calls
    const { isOnboarded } = await getCachedOnboardingStatus();

    if (!isOnboarded) {
      redirect("/onboarding");
    }

    const insights = await getIndustryInsights();

    // Handle errors gracefully - don't redirect on errors to prevent loops
    if (insights?.error) {
      console.error("Dashboard insights error:", insights.error);
    }

    // Only redirect if explicitly requested (user not onboarded)
    // Don't redirect on AI/data errors to prevent loops
    if (insights?.redirect && insights.redirect !== null && !insights?.error && !insights?.warning) {
      redirect(insights.redirect);
    }

    const dashboardData = insights?.data;

    // Validate data exists before rendering - be more lenient to prevent redirect loops
    if (!dashboardData || !dashboardData.industry) {
      // If we have an error or warning, log it but don't redirect (prevents loops)
      if (insights?.error || insights?.warning) {
        console.warn("Dashboard data unavailable, but user is onboarded:", insights.error || insights.warning);
        // Render with minimal default data instead of redirecting
        const defaultData = {
          industry: user?.industry || "Unknown",
          salaryRanges: [],
          growthRate: 0,
          demandLevel: "Medium",
          topSkills: [],
          marketOutlook: "Neutral",
          keyTrends: [],
          recommendedSkills: [],
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DashboardView insights={defaultData} />
          </div>
        );
      }
      // Only redirect if user is truly not onboarded (no error/warning means onboarding issue)
      redirect("/onboarding");
    }

    // Log warnings if present
    if (insights?.warning) {
      console.warn("Dashboard insights warning:", insights.warning);
    }

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardView insights={dashboardData} />
      </div>
    );
  } catch (error) {
    // Only redirect if it's not already a redirect error
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error("Dashboard page error:", error);
    redirect("/onboarding");
  }
}