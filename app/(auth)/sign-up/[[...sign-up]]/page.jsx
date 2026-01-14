"use client"

import dynamic from 'next/dynamic'

// Dynamically import SignUp with SSR disabled to prevent hydration mismatches
const SignUp = dynamic(
  () => import('@clerk/nextjs').then((mod) => ({ default: mod.SignUp })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    ),
  }
)

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  )
}

export default page