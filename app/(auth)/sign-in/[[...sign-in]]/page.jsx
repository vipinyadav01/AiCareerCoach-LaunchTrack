"use client"

import dynamic from 'next/dynamic'

const SignIn = dynamic(
  () => import('@clerk/nextjs').then((mod) => ({ default: mod.SignIn })),
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
      <SignIn />
    </div>
  )
}

export default page