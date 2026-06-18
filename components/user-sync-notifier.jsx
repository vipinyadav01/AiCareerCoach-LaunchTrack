"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Client component that shows toast notifications for user sync results
 * Used in server components where we can't directly show toasts
 */
export function UserSyncNotifier({ syncResult }) {
  const pathname = usePathname();
  const hasShownError = useRef(false);

  useEffect(() => {
    // Only show notifications on protected routes
    const protectedRoutes = ['/onboarding', '/dashboard', '/resume', '/ai-cover-letter', '/interview'];
    const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route));

    if (!isProtectedRoute || !syncResult) {
      return;
    }

    if (syncResult.success) {
      // Don't show success toast on every page load - only on first sync
      // The sync happens silently in the background
      hasShownError.current = false;
      return;
    }

    // Only show error once per sync result
    if (syncResult.error &&
      syncResult.error !== 'No authenticated user found' &&
      !hasShownError.current) {
      hasShownError.current = true;
      toast.error('Failed to sync account', {
        description: syncResult.error || 'Please refresh the page',
        duration: 5000,
        action: {
          label: 'Retry',
          onClick: () => window.location.reload(),
        },
      });
    }
  }, [syncResult, pathname]);

  return null;
}
