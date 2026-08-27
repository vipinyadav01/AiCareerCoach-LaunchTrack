"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./splash-screen";
import { useSplashInitializer } from "./splash-initializer";

const SPLASH_SHOWN_KEY = 'launchtrack_splash_shown';

export default function LayoutWrapper({ children }) {
  // Whether the branded splash overlay is currently shown. It only appears on
  // the first visit of a session; page content is always server-rendered
  // underneath so it paints immediately (the splash is an opaque overlay).
  //
  // We start `true` on both server and client to avoid a hydration mismatch,
  // then hide it in an effect if it has already been shown this session.
  const [showSplash, setShowSplash] = useState(true);

  const { progress, statusMessage } = useSplashInitializer();

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(SPLASH_SHOWN_KEY)) {
      setShowSplash(false);
    }
  }, []);

  // SplashScreen owns its own dismissal timing (a short minimum display, then a
  // fade-out) and calls onComplete when it is done.
  const handleSplashComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SPLASH_SHOWN_KEY, 'true');
    }
    setShowSplash(false);
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
      {children}
    </>
  );
}
