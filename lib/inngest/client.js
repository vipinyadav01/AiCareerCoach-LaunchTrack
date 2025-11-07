import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "launchtrack",
  name: "LaunchTrack",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});