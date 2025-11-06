export function HeadMeta() {
  return (
    <>
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
    </>
  );
}
