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
    // Ensure the Neon Auth user exists in the DB (checkUser is React-cached)
    const user = await checkUser();

    if (!user) {
      redirect("/auth/sign-in");
    }

    // Now check onboarding status (uses the cached version to avoid duplicate calls)
    const onboardingStatus = await getCachedOnboardingStatus();

    if (!onboardingStatus.isOnboarded) {
      // Missing onboarding fields (logging removed)
      redirect("/onboarding");
    }

    const insights = await getIndustryInsights();

    // Handle errors gracefully - don't redirect on errors to prevent loops
    // Dashboard insights error (logging removed)

    // Only redirect if explicitly requested (user not onboarded)
    // Don't redirect on AI/data errors to prevent loops
    if (insights?.redirect && insights.redirect !== null && !insights?.error && !insights?.warning) {
      redirect(insights.redirect);
    }

    const dashboardData = insights?.data;

    // Validate data exists before rendering - be more lenient to prevent redirect loops
    if (!dashboardData || !dashboardData.industry) {
      // If we have an error or warning, don't redirect (prevents loops)
      if (insights?.error || insights?.warning) {
        // Dashboard data unavailable (logging removed)
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
<DashboardView insights={defaultData} userSkills={user?.skills || []} />
        );
      }
      // Only redirect if user is truly not onboarded (no error/warning means onboarding issue)
      redirect("/onboarding");
    }

    // Dashboard insights warning (logging removed)

    return (
<DashboardView insights={dashboardData} userSkills={user?.skills || []} />
    );
  } catch (error) {
    // Only redirect if it's not already a redirect error
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    // Let the error boundary offer a retry. Redirecting to onboarding here
    // used to throw people out of the app on any temporary failure.
    throw error;
  }
}