import { Suspense } from "react";
import { Screen, Skeleton } from "@/components/app/screen";

function InterviewSkeleton() {
  return (
    <Screen>
      <div className="mb-8 space-y-3 border-b pb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="mt-6 h-72 w-full rounded-xl" />
      <span className="sr-only">Loading interview practice</span>
    </Screen>
  );
}

export default function Layout({ children }) {
  return <Suspense fallback={<InterviewSkeleton />}>{children}</Suspense>;
}
