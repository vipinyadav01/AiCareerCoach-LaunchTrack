"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  // Don't render until hydrated to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className="relative p-2 rounded-lg border border-transparent bg-gray-100 dark:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
        disabled
      >
        <Moon className="w-5 h-5 text-gray-400" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-lg transition-all duration-300 group border border-transparent hover:border-amber-200 dark:hover:border-indigo-700/50 hover:bg-amber-50 dark:hover:bg-indigo-900/20 hover:shadow-md dark:hover:shadow-indigo-900/30 cursor-pointer active:scale-95"
      role="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
    >
      <div className={`relative transition-all duration-300 ${isDark
          ? "rotate-0 scale-100"
          : "rotate-180 scale-100"
        }`}>
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400 group-hover:text-amber-500 transition-colors" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors" />
        )}
      </div>
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDark
          ? "bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
          : "bg-gradient-to-br from-amber-500/10 to-orange-500/10"
        }`} />
    </button>
  )
}