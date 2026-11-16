import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { checkUser } from '@/lib/checkUser';
import { UserSyncNotifier } from '@/components/user-sync-notifier';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar, AppTopBar } from '@/components/app-sidebar';

export default async function MainLayout({ children }) {
  // checkUser() reads the Neon Auth session and upserts the user into the DB.
  // It is memoized with React cache() for the request, so child pages reuse it.
  const user = await checkUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const syncResult = { success: true, user };
  // Remember whether the sidebar was collapsed (cookie written by SidebarProvider).
  const defaultOpen = (await cookies()).get('sidebar_state')?.value !== 'false';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <UserSyncNotifier syncResult={syncResult} />
        <AppTopBar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
