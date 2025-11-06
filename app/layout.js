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


export const metadata = {
  metadataBase: new URL('https://launchtrack.vercel.app'),
  title: {
    default: "LaunchTrack - AI Career Platform | Personalized Job Search & Interview Prep",
    template: "%s | LaunchTrack - AI Career Platform"
  },
  description: "Transform your career with LaunchTrack's AI-powered career coach. Get personalized job search assistance, interview preparation, cover letter generation, and career guidance. From GLA University students to professionals worldwide.",
  keywords: [
    "LaunchTrack",
    "AI Career Platform",
    "Job Search AI",
    "Interview Preparation",
    "Cover Letter Generator",
    "Career Guidance",
    "AI Job Assistant",
    "Career Development",
    "Professional Growth",
    "Job Interview AI",
    "Resume Builder",
    "Career Coaching",
    "Employment Assistant",
    "GLA University",
    "Vipin Yadav",
    "Career Technology",
    "AI Career Tools",
    "Job Search Platform",
    "Interview Practice",
    "Career Success",
    "Professional Development",
    "AI Career Advisor",
    "Job Application Help",
    "Career Planning",
    "Employment Guidance"
  ],
  authors: [{ name: "Vipin Yadav", url: "https://github.com/vipinyadav01" }],
  creator: "LaunchTrack - Vipin Yadav",
  publisher: "LaunchTrack",
  category: "education",
  classification: "Career Development, AI Tools, Education Technology, Job Search",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LaunchTrack",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "LaunchTrack - AI Career Platform",
    title: "LaunchTrack - AI Career Platform | Personalized Job Search & Interview Prep",
    description: "Transform your career with LaunchTrack's AI-powered career coach. Get personalized job search assistance, interview preparation, cover letter generation, and career guidance.",
    url: "https://launchtrack.vercel.app",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "LaunchTrack - AI Career Platform Logo",
        type: "image/png",
      },
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "LaunchTrack - AI Career Platform Banner",
        type: "image/png",
      }
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@LaunchTrack",
    creator: "@LaunchTrack",
    title: "LaunchTrack - AI Career Platform | Personalized Job Search & Interview Prep",
    description: "Transform your career with LaunchTrack's AI-powered career coach. Get personalized job search assistance, interview preparation, and career guidance.",
    images: ["/android-chrome-512x512.png"],
  },
  alternates: {
    canonical: "https://launchtrack.vercel.app",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#EFEDE4",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
    <html lang="en" suppressHydrationWarning>
            <head>
        {/* PWA and App Configuration */}
        <meta name="application-name" content="LaunchTrack" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LaunchTrack" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#070D0D" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Enhanced Favicon Configuration */}
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png?v=2" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png?v=2" />
        
        {/* SEO and Search Engine Tags */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <link rel="canonical" href="https://launchtrack.vercel.app" />
        
        {/* Geographic and Language Tags */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="Mathura, Uttar Pradesh" />
        <meta name="geo.position" content="27.4924;77.6737" />
        <meta name="ICBM" content="27.4924, 77.6737" />
        <meta name="language" content="en" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="rating" content="general" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="theme-color" content="#EFEDE4" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#070D0D" media="(prefers-color-scheme: dark)" />
        <meta name="author" content="Vipin Yadav" />
        <meta name="copyright" content="LaunchTrack" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Enhanced JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "LaunchTrack - AI Career Platform",
              "description": "AI-powered career coach for job search, interview preparation, and career guidance",
              "url": "https://launchtrack.vercel.app",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Any",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "creator": {
                "@type": "Person",
                "name": "Vipin Yadav",
                "url": "https://github.com/vipinyadav01"
              },
              "publisher": {
                "@type": "Organization",
                "name": "LaunchTrack",
                "url": "https://launchtrack.vercel.app"
              },
              "keywords": "AI Career Platform, Job Search, Interview Preparation, GLA University, LaunchTrack, Career Development",
              "featureList": [
                "AI-powered job search assistance",
                "Interview preparation tools",
                "Cover letter generation",
                "Career guidance and planning",
                "Resume optimization",
                "Industry insights"
              ],
              "screenshot": "https://launchtrack.vercel.app/android-chrome-512x512.png",
              "softwareVersion": "1.0.0",
              "datePublished": "2024-01-01",
              "dateModified": new Date().toISOString().split('T')[0]
            })
          }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "LaunchTrack",
              "url": "https://launchtrack.vercel.app",
              "logo": "https://launchtrack.vercel.app/android-chrome-512x512.png",
              "description": "AI-powered career coaching platform",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mathura",
                "addressRegion": "Uttar Pradesh",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "English"
              },
              "sameAs": [
                "https://github.com/vipinyadav01"
              ]
            })
          }}
        />
        
        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="LaunchTrack - AI Career Platform | Personalized Job Search & Interview Prep" />
        <meta property="og:description" content="Transform your career with LaunchTrack's AI-powered career coach. Get personalized job search assistance, interview preparation, cover letter generation, and career guidance." />
        <meta property="og:site_name" content="LaunchTrack" />
        <meta property="og:url" content="https://launchtrack.vercel.app" />
        <meta property="og:image" content="https://launchtrack.vercel.app/android-chrome-512x512.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="LaunchTrack - AI Career Platform Logo" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:type" content="image/png" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@LaunchTrack" />
        <meta name="twitter:creator" content="@LaunchTrack" />
        <meta name="twitter:title" content="LaunchTrack - AI Career Platform | Personalized Job Search & Interview Prep" />
        <meta name="twitter:description" content="Transform your career with LaunchTrack's AI-powered career coach. Get personalized job search assistance, interview preparation, and career guidance." />
        <meta name="twitter:image" content="https://launchtrack.vercel.app/android-chrome-512x512.png" />
        <meta name="twitter:image:alt" content="LaunchTrack - AI Career Platform Logo" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Custom Font Preloads */}
        <link rel="preload" href="/fonts/font-nav.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/fonts/variable/JetBrainsMono[wght].ttf" as="font" type="font/truetype" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/fonts/variable/JetBrainsMono-Italic[wght].ttf" as="font" type="font/truetype" crossOrigin="anonymous" />
        
        <link rel="preconnect" href="https://clerk.accounts.dev" />
        <link rel="dns-prefetch" href="https://clerk.accounts.dev" />
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
              <footer className="bg-muted/50  text-white py-12 text-center">
                <div className="container mx-auto px-4 text-center text-gray-300">
                  <p className="text-sm">
                    © {new Date().getFullYear()} AI Career Platform. All rights reserved.
                  </p>
                </div>
              </footer>
            </ThemeProvider>
        </LayoutWrapper>
      </body>
    </html>
    </ClerkProvider>
  );
}
