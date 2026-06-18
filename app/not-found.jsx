import React from 'react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
            <div className="text-center max-w-md mx-auto">
                <h1 className="text-9xl font-bold text-slate-600">404</h1>
                <div className="w-24 h-1 bg-slate-600 mx-auto my-6"></div>
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <Link href="/" className="px-6 py-3 bg-slate-600 text-white font-medium rounded-md hover:bg-slate-700 transition-colors duration-300 inline-flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Return Home
                </Link>
            </div>
        </div>
    )
}
