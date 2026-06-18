import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "launchtrack",
  name: "LaunchTrack",
  // Note: eventKey is used when sending events via inngest.send()
  // signingKey is used by serve() in the API route
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});