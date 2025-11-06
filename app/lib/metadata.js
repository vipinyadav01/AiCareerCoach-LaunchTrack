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
