import { getUserOnboardingStatus } from '@/actions/user';
import { syncUserToDatabase } from '@/actions/sync-user';
import { industries } from '@/data/industries';
import { redirect } from 'next/navigation';
import React from 'react';
import OnboardingForm from './_components/onboarding-form';
import { checkUser } from '@/lib/checkUser';
import { cache } from 'react';
import { UserSyncNotifier } from '@/components/user-sync-notifier';

// Cache the onboarding check within a request to prevent duplicate calls
const getCachedOnboardingStatus = cache(getUserOnboardingStatus);

export const dynamic = 'force-dynamic';

const onboardingPage = async () => {
  try {
    // First, explicitly sync user to database to ensure data is stored
    const syncResult = await syncUserToDatabase();

    // Sync result checked (logging removed)

    // Ensure user exists in DB
    // checkUser is already cached with React cache
    const user = await checkUser();

    if (!user) {
      // User not authenticated, redirect to sign in
      redirect("/auth/sign-in");
    }

    // If user is temporary (from error fallback), try to sync again
    if (user.isTemporary) {
      const retrySync = await syncUserToDatabase();
      // Retry sync attempted (logging removed)
    }

    // Check if user is already onboarded - use cached version
    const onboardingStatus = await getCachedOnboardingStatus();

    // Only redirect to dashboard if user has completed ALL required onboarding fields
    if (onboardingStatus.isOnboarded) {
      // If user is already onboarded, redirect to the dashboard
      redirect("/dashboard");
    }

    // If onboarding is incomplete, show the form

    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <UserSyncNotifier syncResult={syncResult} />
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