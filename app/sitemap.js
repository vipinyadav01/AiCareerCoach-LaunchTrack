import { SITE_URL } from "./lib/site";

// Only publicly reachable, indexable pages belong here.
export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
