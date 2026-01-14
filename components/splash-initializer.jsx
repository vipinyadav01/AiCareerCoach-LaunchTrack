"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";

/**
 * Splash Screen Initialization Logic
 * 
 * Purpose:
 * - Show branding while app initializes
 * - Load essential resources
 * - Check authentication state
 * - Prepare app environment
 * 
 * Flow:
 * 1. Show splash (2-3 seconds minimum)
 * 2. Run parallel initialization tasks
 * 3. Check authentication state
 * 4. Navigate based on state
 */
export function useSplashInitializer() {
  const { isLoaded: clerkLoaded, isSignedIn, userId } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [appState, setAppState] = useState('loading'); // 'loading' | 'ready' | 'authenticated' | 'guest'
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing...');
  const [initializationComplete, setInitializationComplete] = useState(false);

  // Helper function to delay execution
  const delay = useCallback((ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }, []);

  // Check network connection
  const checkNetworkConnection = useCallback(async () => {
    if (typeof window !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  }, []);

  // Preload critical assets
  const preloadAssets = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const criticalImages = [
        '/android-chrome-512x512.png',
        '/favicon-32x32.png',
      ];

      const preloadPromises = criticalImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails
          img.src = src;
        });
      });

      await Promise.all(preloadPromises);
    }
  }, []);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    // Wait for Clerk to be fully loaded
    if (!clerkLoaded) {
      return { authenticated: false, firstTime: false, loading: true };
    }

    // User is not signed in
    if (!isSignedIn || !userId) {
      return { authenticated: false, firstTime: true, loading: false };
    }

    // User is signed in, check onboarding status
    try {
      const onboardingStatus = await getUserOnboardingStatus();
      return {
        authenticated: true,
        firstTime: false,
        loading: false,
        isOnboarded: onboardingStatus?.success && onboardingStatus?.isOnboarded || false,
      };
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // On error, assume authenticated but not onboarded
      return {
        authenticated: true,
        firstTime: false,
        loading: false,
        isOnboarded: false,
      };
    }
  }, [clerkLoaded, isSignedIn, userId]);

  // Initialize app with parallel tasks
  const initializeApp = useCallback(async () => {
    const minDisplayTime = 5000; // 5 seconds minimum
    const startTime = Date.now();

    try {
      // Update progress and status
      setProgress(10);
      setStatusMessage('Checking network connection...');

      // Check network first (quick check)
      const networkStatus = await checkNetworkConnection();

      if (!networkStatus) {
        setStatusMessage('No network connection detected');
      }

      setProgress(30);
      setStatusMessage('Verifying authentication...');

      // Check auth status (this may take longer)
      const authStatus = await checkAuthStatus();

      // If still loading auth, wait a bit more
      if (authStatus.loading) {
        await delay(500);
        const retryAuthStatus = await checkAuthStatus();
        Object.assign(authStatus, retryAuthStatus);
      }

      setProgress(60);
      setStatusMessage('Loading resources...');

      // Preload assets in parallel with other tasks
      await preloadAssets();

      setProgress(85);
      setStatusMessage('Preparing environment...');

      // Ensure minimum display time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minDisplayTime) {
        await delay(minDisplayTime - elapsedTime);
      }

      setProgress(100);
      setStatusMessage('Ready!');

      // Determine navigation based on auth state
      if (authStatus.loading) {
        // Still loading, wait a bit more
        setAppState('loading');
        return;
      }

      if (authStatus.authenticated) {
        if (!authStatus.isOnboarded) {
          // Authenticated but not onboarded
          setAppState('ready');
          // Don't navigate here, let the app handle it via middleware
        } else {
          // Authenticated and onboarded
          setAppState('authenticated');
        }
      } else {
        // Not authenticated
        setAppState('guest');
      }

      setInitializationComplete(true);
    } catch (error) {
      console.error('Initialization error:', error);
      setStatusMessage('Initialization complete');
      setProgress(100);
      setAppState('ready');
      setInitializationComplete(true);
    }
  }, [checkNetworkConnection, checkAuthStatus, preloadAssets, delay]);

  useEffect(() => {
    // Only start initialization when Clerk is loaded
    // This ensures we have accurate auth state before proceeding
    if (clerkLoaded) {
      initializeApp();
    } else {
      // Show initial loading state while Clerk loads
      setProgress(5);
      setStatusMessage('Loading authentication...');
    }
  }, [clerkLoaded, initializeApp]);

  // Handle navigation based on app state after splash completes
  useEffect(() => {
    if (!initializationComplete) return;

    const publicRoutes = ['/', '/sign-in', '/sign-up'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is not authenticated and not on a public route, navigate to home
    if (appState === 'guest' && !isPublicRoute) {
      router.push('/');
      return;
    }

    // If user is authenticated but on sign-in/sign-up page, let Clerk handle redirect
    // (Clerk will automatically redirect authenticated users away from auth pages)
    if (appState === 'authenticated' && (pathname === '/sign-in' || pathname === '/sign-up')) {
      // Clerk middleware will handle redirect to dashboard/onboarding
      return;
    }

    // If user is guest and on home page, stay on home page
    if (appState === 'guest' && pathname === '/') {
      return; // Already on home page
    }

    // If user is authenticated and on protected route, stay there
    if (appState === 'authenticated' && !isPublicRoute) {
      return; // Already on a protected route
    }
  }, [appState, initializationComplete, pathname, router]);

  return {
    appState,
    progress,
    statusMessage,
    initializationComplete,
    isAuthenticated: isSignedIn,
    isOnboarded: appState === 'authenticated',
  };
}
