"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./splash-screen";
import { useSplashInitializer } from "./splash-initializer";

export default function LayoutWrapper({ children }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [splashStartTime] = useState(() => Date.now());

  // Use splash initializer hook for proper initialization logic
  const {
    progress,
    statusMessage,
    initializationComplete,
  } = useSplashInitializer();

  // Always show splash for minimum 5 seconds
  useEffect(() => {
    if (initializationComplete && progress >= 100) {
      const minDisplayTime = 5000; // 5 seconds
      const elapsedTime = Date.now() - splashStartTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      const timer = setTimeout(() => {
        setShowSplash(false);
        setTimeout(() => setIsLoaded(true), 100);
      }, remainingTime + 300); // Add small buffer for fade out

      return () => clearTimeout(timer);
    }
  }, [initializationComplete, progress, splashStartTime]);

  const handleSplashComplete = () => {
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
