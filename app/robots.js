import { SITE_URL } from "./lib/site";

// Served per host at /robots.txt. Signed-in app routes redirect to sign-in,
// so there is nothing for crawlers to index behind them.
const privateRoutes = [
  "/api/",
  "/dashboard",
  "/resume",
  "/ai-cover-letter",
  "/interview",
  "/onboarding",
  "/diagnostics",
  "/account",
  "/auth/",
];

const aiTrainingBots = ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai", "Claude-Web"];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privateRoutes },
      { userAgent: aiTrainingBots, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
