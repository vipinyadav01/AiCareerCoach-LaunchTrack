import { Inngest } from "inngest";

/**
 * Inngest client.
 *
 * The event key (for sending events) and signing key (for serving functions)
 * are read automatically from the environment — INNGEST_EVENT_KEY and
 * INNGEST_SIGNING_KEY — so they must NOT be passed per-send. `credentials` is
 * not a valid client option and was removed.
 */
export const inngest = new Inngest({
  id: "launchtrack",
});
