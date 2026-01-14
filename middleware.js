import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/resume(.*)',
  '/ai-cover-letter(.*)',
  '/interview(.*)',
  '/onboarding(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/inngest(.*)',
  '/api/auth(.*)', // Clerk OAuth callbacks
  '/api/diagnostics(.*)', // Diagnostics routes
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Allow public routes and Clerk API routes to pass through
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // Protect routes that require authentication
    if (isProtectedRoute(req)) {
      const { userId } = await auth();
      if (!userId) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Clerk middleware error:', error);
    // Don't block OAuth callbacks on error
    if (req.url.includes('/api/auth/')) {
      return NextResponse.next();
    }
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|.*\\.ico).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};