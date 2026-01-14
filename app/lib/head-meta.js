export function HeadMeta() {
  return (
    <>
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#070D0D" />
      <meta name="msapplication-tap-highlight" content="no" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="Mathura, Uttar Pradesh" />
      <meta name="geo.position" content="27.4924;77.6737" />
      <meta name="ICBM" content="27.4924, 77.6737" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
      <meta name="msvalidate.01" content="your-bing-verification-code" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Custom Font Preloads */}
      <link rel="preload" href="/fonts/font-nav.otf" as="font" type="font/otf" crossOrigin="anonymous" />
      
      <link rel="preconnect" href="https://clerk.accounts.dev" />
      <link rel="dns-prefetch" href="https://clerk.accounts.dev" />
    </>
  );
}
