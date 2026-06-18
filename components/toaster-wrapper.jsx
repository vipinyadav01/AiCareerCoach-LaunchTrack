"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const DynamicToaster = dynamic(
  () => import("@/components/ui/sonner").then((mod) => ({ default: mod.Toaster })),
  {
    ssr: false,
    loading: () => null,
  }
)

export function ToasterWrapper(props) {
  return (
    <Suspense fallback={null}>
      <DynamicToaster {...props} />
    </Suspense>
  )
}
