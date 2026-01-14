import { checkUser } from '@/lib/checkUser';
import { syncUserToDatabase } from '@/actions/sync-user';
import { redirect } from 'next/navigation';
import React from 'react';
import { UserSyncNotifier } from '@/components/user-sync-notifier';

export default async function MainLayout({ children }) {
  const syncResult = await syncUserToDatabase();
  
  // Sync result checked (logging removed)

  const user = await checkUser();

  if (!user) {
    redirect('/auth/sign-in');
  }
  if (!user.id || user.isTemporary) {
    const retrySync = await syncUserToDatabase();
    // Retry sync attempted (logging removed)
  }

  const { getUserOnboardingStatus } = await import('@/actions/user');
  const onboardingStatus = await getUserOnboardingStatus();
  if (!onboardingStatus.isOnboarded && onboardingStatus.missingFields?.length > 0) {

  }
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <UserSyncNotifier syncResult={syncResult} />
        <div className='container mx-auto mt-24 mb-20'>{children}</div>
      </div>
    </div>
  );
}
