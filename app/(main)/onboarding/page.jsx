import { getUserOnboardingStatus } from '@/actions/user';
import { industries } from '@/data/industries';
import { redirect } from 'next/navigation';
import React from 'react';
import OnboardingForm from './_components/onboarding-form';
import { checkUser } from '@/lib/checkUser';
import { cache } from 'react';

// Cache the onboarding check within a request to prevent duplicate calls
const getCachedOnboardingStatus = cache(getUserOnboardingStatus);

export const dynamic = 'force-dynamic';

const onboardingPage = async () => {
  try {
    // Ensure user exists in DB
    // checkUser is already cached with React cache
    const user = await checkUser();

    if (!user) {
      // User not authenticated, redirect to sign in
      redirect("/sign-in");
    }

    // Check if user is already onboarded - use cached version
    const { isOnboarded } = await getCachedOnboardingStatus();
    if (isOnboarded) {
      // If user is already onboarded, redirect to the dashboard
      redirect("/dashboard");
    }

    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <OnboardingForm industries={industries} />
      </main>
    );
  } catch (error) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }

    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <OnboardingForm industries={industries} />
      </main>
    );
  }
}

export default onboardingPage