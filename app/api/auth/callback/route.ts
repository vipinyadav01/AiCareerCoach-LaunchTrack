import { neonAuth } from '@neondatabase/auth/next/server';
import { checkUser } from '@/lib/checkUser';
import { getUserOnboardingStatus } from '@/actions/user';
import { NextResponse } from 'next/server';

/**
 * Auth callback handler
 * Called after successful signup/signin to sync user and redirect appropriately.
 * Redirects are built relative to the incoming request origin so they work in
 * every environment (local, preview, production) without extra configuration.
 */
export async function GET(request: Request) {
  try {
    // Get current user from Neon Auth
    const { user, session } = await neonAuth();

    if (!user || !session) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    // Sync user to database
    await checkUser();

    // Check onboarding status
    const { isOnboarded } = await getUserOnboardingStatus();

    // Redirect based on onboarding status
    return NextResponse.redirect(
      new URL(isOnboarded ? '/dashboard' : '/onboarding', request.url)
    );
  } catch (error) {
    console.error('Auth callback error:', error);
    // On error, redirect to sign-in
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }
}
