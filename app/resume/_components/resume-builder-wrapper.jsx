"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ResumeBuilderComponent = dynamic(() => import('./resume-builder-client'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#070D0D] via-[#0A1010] to-[#070D0D] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#EFEDE4]/20 to-amber-200/20 rounded-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#EFEDE4] animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-[#EFEDE4]">Loading Resume Builder</h3>
        <p className="text-[#EFEDE4]/70">Preparing your resume creation tools...</p>
      </div>
    </div>
  )
});

export default function ResumeBuilder(props) {
  return <ResumeBuilderComponent {...props} />;
}
