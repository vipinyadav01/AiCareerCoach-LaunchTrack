"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EmailVerification } from '@/components/email-verification';
import { authClient } from '@/lib/auth/client';
import { syncUserToDatabase } from '@/actions/sync-user';
import { toast } from 'sonner';

function VerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from URL params or sessionStorage
    const emailParam = searchParams.get('email');
    const storedEmail = typeof window !== 'undefined'
      ? sessionStorage.getItem('pending_verification_email')
      : null;

    const emailToUse = emailParam || storedEmail;
    if (emailToUse) {
      setEmail(emailToUse);
      if (typeof window !== 'undefined' && !emailParam) {
        sessionStorage.setItem('pending_verification_email', emailToUse);
      }
    } else {
      // No email found, redirect to sign-up
      router.push('/auth/sign-up');
    }
  }, [searchParams, router]);

  const handleVerified = async (session) => {
    // Clear stored email
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('pending_verification_email');
    }

    if (session) {
      // User is automatically signed in
      // Explicitly sync user to database immediately
      try {
        toast.loading('Setting up your account...', { id: 'sync-user' });
        const syncResult = await syncUserToDatabase();

        if (syncResult.success) {
          toast.success('Account created successfully!', {
            id: 'sync-user',
            description: 'Redirecting to onboarding...'
          });
        } else {
          toast.error('Failed to create account', {
            id: 'sync-user',
            description: syncResult.error || 'Please try again'
          });
        }
      } catch (error) {
        toast.error('Error setting up account', {
          id: 'sync-user',
          description: error.message || 'Please try again'
        });
      }

      // Redirect to onboarding - it will also sync user as a fallback
      setTimeout(() => {
        router.push('/onboarding');
        router.refresh(); // Refresh to trigger server-side user sync
      }, 1000);
    } else {
      // Email verified but needs to sign in
      toast.info('Email verified! Please sign in to continue.');
      router.push('/auth/sign-in');
    }
  };

  const handleCancel = () => {
    // Clear stored email and go back
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('pending_verification_email');
    }
    router.push('/auth/sign-up');
  };

  if (!email) {
    return (
      <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <EmailVerification
        email={email}
        onVerified={handleVerified}
        onCancel={handleCancel}
      />
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center">Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
