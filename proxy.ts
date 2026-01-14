import { neonAuthMiddleware } from "@neondatabase/auth/next/server";

export default neonAuthMiddleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    // Protected routes requiring authentication
    "/dashboard/:path*",
    "/resume/:path*",
    "/ai-cover-letter/:path*",
    "/interview/:path*",
    // Note: /onboarding is protected but handled by layout to check onboarding status
  ],
};
