"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const SplashScreen = ({ onComplete, progress = 0, statusMessage = 'Initializing...' }) => {
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    // When progress reaches 100%, ensure minimum 5 seconds display time
    if (progress >= 100) {
      const minDisplayTime = 5000; // 5 seconds
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      const timer = setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          onComplete?.();
        }, 400);
      }, remainingTime + 200);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete, startTime]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black"
          style={{
            height: '100dvh',
            width: '100dvw',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            touchAction: 'none',
          }}
        >
          {/* Minimal grid pattern background */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              color: 'currentColor',
            }} />
          </div>

          <div className="relative flex flex-col items-center justify-center space-y-8 px-4 max-w-md w-full">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative mb-4"
            >
              <div className="relative w-20 h-20 flex items-center justify-center">
                <img
                  src="/android-chrome-512x512.png"
                  alt="LaunchTrack Logo"
                  className="w-full h-full object-contain"
                  style={{
                    imageRendering: 'crisp-edges',
                    WebkitImageRendering: 'crisp-edges',
                  }}
                />
                {/* Subtle pulse ring */}
                <motion.div
                  className="absolute inset-0 border-2 border-black dark:border-white rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center space-y-3"
            >
              <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight">
                LaunchTrack
              </h1>
              <p className="text-sm md:text-base text-black/60 dark:text-white/60 font-medium tracking-wide uppercase">
                AI Career Platform
              </p>
            </motion.div>

            {/* Progress Section */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full space-y-4 pt-4"
            >
              {/* Status Text */}
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-black/70 dark:text-white/70 font-medium uppercase tracking-wider">
                  {statusMessage}
                </span>
                <span className="text-black dark:text-white font-bold tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-black dark:bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                {/* Shimmer effect */}
                {progress < 100 && (
                  <motion.div
                    className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 dark:via-black/30 to-transparent"
                    animate={{
                      x: ['-100%', '400%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
              </div>
            </motion.div>

            {/* Loading Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2 text-xs text-black/50 dark:text-white/50 uppercase tracking-wider"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <span className="ml-2">{progress < 100 ? 'Loading' : 'Ready'}</span>
            </motion.div>
          </div>

          {/* Bottom decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 h-px bg-black/20 dark:bg-white/20"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;