"use client";

import { useEffect } from 'react';

/**
 * Suppresses known Neon Auth 404 errors that don't affect functionality
 * These are internal library bugs where it tries to access object properties as routes
 */
export function ErrorSuppressor() {
  useEffect(() => {
    // Suppress console errors for known Neon Auth 404 endpoints
    const originalError = console.error;
    const originalWarn = console.warn;

    const suppressNeonAuth404 = (...args) => {
      const message = args.join(' ');
      // Suppress 404 errors for display-name endpoints (known Neon Auth bug)
      if (
        message.includes('404') &&
        (message.includes('/display-name/value-of') ||
          message.includes('/display-name/to-string') ||
          message.includes('api/auth/display-name'))
      ) {
        return; // Silently ignore
      }
      originalError.apply(console, args);
    };

    // Override console.error temporarily
    console.error = suppressNeonAuth404;

    // Also suppress unhandled promise rejections for these errors
    const handleUnhandledRejection = (event) => {
      const errorMessage = event.reason?.message || event.reason?.toString() || '';
      if (
        errorMessage.includes('404') &&
        (errorMessage.includes('/display-name/value-of') ||
          errorMessage.includes('/display-name/to-string') ||
          errorMessage.includes('api/auth/display-name'))
      ) {
        event.preventDefault(); // Suppress the error
        return;
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
