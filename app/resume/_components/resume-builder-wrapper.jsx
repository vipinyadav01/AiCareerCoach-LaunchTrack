"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ResumeBuilderComponent = dynamic(() => import('./resume-builder-client'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center" role="status">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Loading the resume builder
      </p>
    </div>
  )
});

export default function ResumeBuilder(props) {
  return <ResumeBuilderComponent {...props} />;
}
