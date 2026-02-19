import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import HeaderWrapper from "@/components/header-wrapper";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import PWAStatus from "@/components/pwa-status";
import LayoutWrapper from "@/components/layout-wrapper";
import { ToasterWrapper } from "@/components/toaster-wrapper";
import { authClient } from "@/lib/auth/client";
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { BackgroundBeams } from "@/components/ui/background-beams";
import ErrorBoundary from "@/components/ErrorBoundary";
import PerfScrollOptimizer from "@/components/perf-scroll-optimizer";
import { HeadMeta } from "./lib/head-meta";
import { StructuredData } from "./lib/structured-data";
import { Footer } from "components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/smooth-scroll";

export { metadata, viewport } from "./lib/metadata";

export default function RootLayout({ children }) {
  return (
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
        <ErrorBoundary>
        <NeonAuthUIProvider
          authClient={authClient}
          redirectTo="/onboarding"
          emailOTP
          social={{
            providers: ['google']
          }}
        >
          <LayoutWrapper>
            <ThemeProvider>
              <SmoothScroll>
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
              </SmoothScroll>
            </ThemeProvider>
          </LayoutWrapper>
        </NeonAuthUIProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
