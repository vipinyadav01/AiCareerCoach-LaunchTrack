
import { getUserOnboardingStatus } from '@/lib/user-status';
import { industries } from '@/data/industries';
import { redirect } from 'next/navigation';
import React from 'react';
import OnboardingForm from './_components/onboarding-form';
import { checkUser } from '@/lib/checkUser';



const onboardingPage = async () => {
  try {
    // Ensure user exists in DB
    const user = await checkUser();
    
    if (!user) {
      // User not authenticated, redirect to sign in
      redirect("/sign-in");
    }

    // Check if user is already onboarded
    const { isOnboarded } = await getUserOnboardingStatus();
    if (isOnboarded) {
      // If user is already onboarded, redirect to the dashboard
      redirect("/dashboard");
    }

    return (
      <main>
        <OnboardingForm industries={industries} />
      </main>
    );
  } catch (error) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    return (
      <main>
        <OnboardingForm industries={industries} />
      </main>
    );
  }
}

export default onboardingPage