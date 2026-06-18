"use client"

import * as React from "react"
import dynamic from "next/dynamic"

// Only import on client side
const DynamicThemeProvider = dynamic(
  () => import("next-themes").then((mod) => ({ default: mod.ThemeProvider })),
  { 
    ssr: false,
    loading: ({ isLoading }) => isLoading ? null : undefined,
  }
)

export function ThemeProvider({
  children,
  ...props
}) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Return children without theme provider during SSR
  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <DynamicThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      storageKey="theme"
      {...props}
    >
      {children}
    </DynamicThemeProvider>
  )
}