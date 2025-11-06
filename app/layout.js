import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import HeaderWrapper from "@/components/header-wrapper";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import PWAStatus from "@/components/pwa-status";
import LayoutWrapper from "@/components/layout-wrapper";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import { Toaster } from "@/components/ui/sonner";
import { BackgroundBeams } from "@/components/ui/background-beams";
import PerfScrollOptimizer from "@/components/perf-scroll-optimizer";
import { HeadMeta } from "./lib/head-meta";
import { StructuredData } from "./lib/structured-data";
import { Footer } from "components/Footer";

export { metadata, viewport } from "./lib/metadata";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
    <html lang="en" suppressHydrationWarning>
            <head>
              <HeadMeta />
              <StructuredData />
      </head>
      <body
        className="font-jetbrains antialiased"
        suppressHydrationWarning={true}
      >
        <LayoutWrapper>
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {/* Global animated background */}
              <BackgroundBeams className="fixed inset-0 -z-10 pointer-events-none" />
              <PerfScrollOptimizer />
              {/* Header */}
              <HeaderWrapper/>
              <main className="min-h-screen">
  {children}
              </main>
              <PWAInstallPrompt />
              <PWAStatus />
              <Toaster richColors/>
              {/* Footer */}
              <Footer />
            </ThemeProvider>
        </LayoutWrapper>
      </body>
    </html>
    </ClerkProvider>
  );
}
