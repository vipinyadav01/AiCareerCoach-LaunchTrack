"use client"

import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

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
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Check for OAuth errors in URL
    const error = searchParams.get('error')
    if (error) {
      if (error.includes('external_account')) {
        toast.error('Google sign-in failed. Please try again or use email/password.', {
          description: 'If this persists, the Google OAuth provider may need to be reconfigured.',
          duration: 5000,
        })
      } else {
        toast.error('Sign-in error occurred. Please try again.')
      }
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn 
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg",
            }
          }}
        />
      </div>
    </div>
  )
}

export default page