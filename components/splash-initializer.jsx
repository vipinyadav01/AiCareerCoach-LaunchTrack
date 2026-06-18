"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useNeonAuth, useNeonUser } from "@/hooks/use-neon-auth";
import { usePathname } from "next/navigation";


export function useSplashInitializer() {
  const { isLoaded: neonAuthLoaded, isSignedIn, userId } = useNeonAuth();
  const { user, isLoaded: userLoaded } = useNeonUser();
  const pathname = usePathname();

  const [appState, setAppState] = useState('loading'); // 'loading' | 'ready' | 'authenticated' | 'guest'
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing...');
  const [initializationComplete, setInitializationComplete] = useState(false);

  // Use ref to prevent multiple initializations
  const hasInitialized = useRef(false);

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
    // Wait for Neon Auth to be fully loaded
    if (!neonAuthLoaded) {
      return { authenticated: false, firstTime: false, loading: true };
    }

    // User is not signed in
    if (!isSignedIn || !userId) {
      return { authenticated: false, firstTime: true, loading: false };
    }

    return {
      authenticated: true,
      firstTime: false,
      loading: false,
      isOnboarded: false, // Will be determined by server-side pages
    };
  }, [neonAuthLoaded, isSignedIn, userId]);

  // Initialize app with parallel tasks
  const initializeApp = useCallback(async () => {
    // Prevent multiple initializations
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    const minDisplayTime = 2000; // 2 seconds minimum
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
    // Only start initialization when Neon Auth is loaded and hasn't been initialized yet
    // This ensures we have accurate auth state before proceeding
    if (neonAuthLoaded && !hasInitialized.current) {
      initializeApp();
    } else if (!neonAuthLoaded) {
      // Show initial loading state while Neon Auth loads
      setProgress(5);
      setStatusMessage('Loading authentication...');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neonAuthLoaded]); // Only depend on neonAuthLoaded to prevent loops

  // Removed empty useEffect that was causing unnecessary re-renders

  return {
    appState,
    progress,
    statusMessage,
    initializationComplete,
    isAuthenticated: isSignedIn,
    isOnboarded: appState === 'authenticated',
  };
}
