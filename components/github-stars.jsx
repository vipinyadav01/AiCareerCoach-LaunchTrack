"use client"
import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

export function GitHubStars({ className = "", showIcon = true, repoUrl = "vipinyadav01/AiCareerCoach", asLink = true }) {
  const [starsCount, setStarsCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchStars = async () => {
      try {
        setLoading(true)
        setError(false)
        const apiUrl = `https://api.github.com/repos/${repoUrl}`
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'AiCareerCoach-App'
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setStarsCount(data.stargazers_count || 0)
        } else {
          setStarsCount(3)
          setError(true)
        }
      } catch (error) {
        console.warn('Failed to fetch GitHub stars:', error)
        setStarsCount(3) 
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchStars()
  }, [repoUrl])

  if (loading) {
    return (
      <div className={`flex items-center gap-1 sm:gap-1.5 ${className}`}>
        {showIcon && <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 animate-pulse" />}
        <span className="text-xs sm:text-sm font-semibold font-nav text-gray-500 dark:text-gray-400">...</span>
      </div>
    )
  }

  const Component = asLink ? 'a' : 'div'
  const linkProps = asLink ? {
    href: `https://github.com/${repoUrl}`,
    target: "_blank",
    rel: "noopener noreferrer"
  } : {}

  return (
    <Component 
      {...linkProps}
      className={`flex items-center gap-1 sm:gap-1.5 ${asLink ? 'hover:scale-105 transition-transform duration-200 cursor-pointer' : ''} ${className}`}
      title={`Star us on GitHub! Currently ${starsCount?.toLocaleString() || '3'} stars`}
    >
      {showIcon && (
        <Star 
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${error ? 'text-gray-400 dark:text-gray-500' : 'text-yellow-500 fill-current hover:text-yellow-600 dark:hover:text-yellow-400'}`} 
        />
      )}
      <span className={`text-xs sm:text-sm font-semibold font-nav transition-colors ${error ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}>
        {starsCount?.toLocaleString() || '3'}
      </span>
    </Component>
  )
}
