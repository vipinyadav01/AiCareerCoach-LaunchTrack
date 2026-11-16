import { Suspense } from "react";
import { Screen, Skeleton } from "@/components/app/screen";

function DashboardSkeleton() {
  return (
    <Screen>
      <div className="mb-8 space-y-3 border-b pb-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-72" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="mt-6 h-80 w-full rounded-xl" />
      <span className="sr-only">Loading your industry insights</span>
    </Screen>
  );
}

export default function Layout({ children }) {
  return <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>;
}
