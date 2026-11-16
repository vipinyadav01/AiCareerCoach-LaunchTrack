"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Screen } from "@/components/app/screen";

// Shown when a signed-in screen fails to load (usually a slow database
// wake-up). Retrying re-fetches the server data instead of signing you out.
export function LoadError({ error, reset }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = () =>
    start(() => {
      router.refresh();
      reset();
    });

  return (
    <Screen>
      <EmptyState
        title="This page could not load"
        description="Your account is fine. The connection to our database timed out, which can happen after a quiet period. Try again in a moment."
        action={
          <div className="flex flex-wrap gap-2">
            <Button onClick={retry} disabled={pending}>
              {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Try again
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/auth/sign-in">Sign in again</Link>
            </Button>
          </div>
        }
      />
    </Screen>
  );
}
