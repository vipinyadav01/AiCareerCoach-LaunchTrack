"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import { useEffect, useState } from "react";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid rendering until hydrated
  if (!mounted) {
    return null
  }

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)"
        }
      }
      {...props} />
  );
}

export { Toaster }
