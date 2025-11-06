export function StructuredData() {
  return (
    <>
      {/* WebApplication Schema */}
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
    </>
  );
}
