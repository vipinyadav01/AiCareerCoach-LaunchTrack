"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./splash-screen";
import { useSplashInitializer } from "./splash-initializer";

const SPLASH_SHOWN_KEY = 'launchtrack_splash_shown';

export default function LayoutWrapper({ children }) {
  // Check if splash has already been shown in this session
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasShownSplash = sessionStorage.getItem(SPLASH_SHOWN_KEY);
    if (hasShownSplash) {
      setShowSplash(false);
      setIsLoaded(true);
    }
  }, []);

  const [isLoaded, setIsLoaded] = useState(false);
  const [splashStartTime] = useState(() => Date.now());

  // Use splash initializer hook for proper initialization logic
  const {
    progress,
    statusMessage,
    initializationComplete,
  } = useSplashInitializer();

  // Always show splash for minimum 2 seconds (only if it hasn't been shown)
  useEffect(() => {
    if (showSplash && initializationComplete && progress >= 100) {
      const minDisplayTime = 2000; // 2 seconds
      const elapsedTime = Date.now() - splashStartTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      const timer = setTimeout(() => {
        // Mark splash as shown in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SPLASH_SHOWN_KEY, 'true');
        }
        setShowSplash(false);
        setTimeout(() => setIsLoaded(true), 100);
      }, remainingTime + 300); // Add small buffer for fade out

      return () => clearTimeout(timer);
    } else if (!showSplash) {
      // If splash was already shown, load immediately
      setIsLoaded(true);
    }
  }, [showSplash, initializationComplete, progress, splashStartTime]);

  const handleSplashComplete = () => {
    // Mark splash as shown in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SPLASH_SHOWN_KEY, 'true');
    }
    setShowSplash(false);
    setTimeout(() => setIsLoaded(true), 100);
  };

  return (
    <>
      {showSplash && (
        <SplashScreen
          onComplete={handleSplashComplete}
          progress={progress}
          statusMessage={statusMessage}
        />
      )}
      <div
        className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        style={{
          visibility: isLoaded ? 'visible' : 'hidden'
        }}
      >
        {children}
      </div>
    </>
  );
}
