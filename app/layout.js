import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import HeaderWrapper from "@/components/header-wrapper";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import PWAStatus from "@/components/pwa-status";
import LayoutWrapper from "@/components/layout-wrapper";
import { ToasterWrapper } from "@/components/toaster-wrapper";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import { BackgroundBeams } from "@/components/ui/background-beams";
import PerfScrollOptimizer from "@/components/perf-scroll-optimizer";
import { HeadMeta } from "./lib/head-meta";
import { StructuredData } from "./lib/structured-data";
import { Footer } from "components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

export { metadata, viewport } from "./lib/metadata";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/onboarding"
      allowedRedirectOrigins={[
        process.env.NEXT_PUBLIC_APP_URL,
        'http://localhost:3000',
        'https://launchtrack.vercel.app',
      ]}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
          <HeadMeta />
          <StructuredData />
        </head>
        <body
          className="open-sans antialiased"
          suppressHydrationWarning={true}
          data-suppress-hydration-warning
        >

          <LayoutWrapper>
            <ThemeProvider>
              {/* Global animated background */}
              <BackgroundBeams className="fixed inset-0 -z-10 pointer-events-none" />
              <PerfScrollOptimizer />
              {/* Header */}
              <HeaderWrapper />
              <main className="min-h-screen">
                {children}
              </main>
              <PWAInstallPrompt />
              <PWAStatus />
              <ToasterWrapper richColors />
              {/* Footer */}
              <Footer />
              <SpeedInsights />
            </ThemeProvider>
          </LayoutWrapper>
  </body>
      </html>
    </ClerkProvider>
  );
}
