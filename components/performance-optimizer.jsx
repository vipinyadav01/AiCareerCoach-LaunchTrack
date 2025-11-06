import React from 'react';

const PerformanceOptimizer = () => {
  return (
    <>
      {/* Preload critical resources */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//clerk.accounts.dev" />
      <link rel="dns-prefetch" href="//vercel.com" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://clerk.accounts.dev" />
      
      {/* Resource hints for better performance */}
      <link rel="preload" href="/android-chrome-512x512.png" as="image" />
      <link rel="preload" href="/banner.png" as="image" />
      
      {/* Critical CSS inlining */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for above-the-fold content */
          .critical-hidden { visibility: hidden; }
          .critical-visible { visibility: visible; }
          
          /* Optimize font loading */
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('/fonts/inter-var.woff2') format('woff2');
          }
          
          /* Reduce layout shift */
          img, video, iframe {
            max-width: 100%;
            height: auto;
          }
          
          /* Optimize animations */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `
      }} />
      
      {/* Service Worker registration for PWA */}
      <script dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        // avoid noisy logs in production
                        if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
                          console.log('SW registered: ', registration);
                        }
                      })
                      .catch(function(registrationError) {
                        if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
                          console.log('SW registration failed: ', registrationError);
                        }
                      });
            });
          }
        `
      }} />
      
      {/* Performance monitoring */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Core Web Vitals monitoring
          if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                // Only emit core web vital logs during development to avoid console spam
                if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
                  if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                  }
                  if (entry.entryType === 'first-input') {
                    console.log('FID:', entry.processingStart - entry.startTime);
                  }
                  if (entry.entryType === 'layout-shift') {
                    console.log('CLS:', entry.value);
                  }
                }
              }
            });
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
          }
        `
      }} />
    </>
  );
};

export default PerformanceOptimizer; 