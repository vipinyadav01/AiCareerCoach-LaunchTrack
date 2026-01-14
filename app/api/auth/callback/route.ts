import { neonAuth } from '@neondatabase/auth/next/server';
import { checkUser } from '@/lib/checkUser';
import { getUserOnboardingStatus } from '@/actions/user';
import { NextResponse } from 'next/server';

/**
 * Auth callback handler
 * Called after successful signup/signin to sync user and redirect appropriately
 */
export async function GET() {
  try {
    // Get current user from Neon Auth
    const { user, session } = await neonAuth();

    if (!user || !session) {
      return NextResponse.redirect(new URL('/auth/sign-in', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
    }

    // Sync user to database
    await checkUser();

    // Check onboarding status
    const { isOnboarded } = await getUserOnboardingStatus();

    // Redirect based on onboarding status
    if (isOnboarded) {
      return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
    } else {
      return NextResponse.redirect(new URL('/onboarding', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
    }
  } catch (error) {
    console.error('Auth callback error:', error);
    // On error, redirect to sign-in
    return NextResponse.redirect(new URL('/auth/sign-in', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }
}
