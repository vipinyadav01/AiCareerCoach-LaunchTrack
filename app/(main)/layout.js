import { checkUser } from '@/lib/checkUser';
import { redirect } from 'next/navigation';
import React from 'react';
import { UserSyncNotifier } from '@/components/user-sync-notifier';

export default async function MainLayout({ children }) {
  // checkUser() reads the Neon Auth session and upserts the user into the DB.
  // It is memoized with React cache() for the request, so calling it here and
  // again in child pages performs the work only once. There is no need for a
  // separate syncUserToDatabase() upsert or an extra onboarding query.
  const user = await checkUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const syncResult = { success: true, user };

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <UserSyncNotifier syncResult={syncResult} />
        <div className='container mx-auto mt-24 mb-20'>{children}</div>
      </div>
    </div>
  );
}
