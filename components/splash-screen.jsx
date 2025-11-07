"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const SplashScreen = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Predefined positions to avoid hydration mismatch
  const particlePositions = [
    { left: 15, top: 20, duration: 3.5, delay: 0.2 },
    { left: 85, top: 15, duration: 4.2, delay: 0.8 },
    { left: 25, top: 80, duration: 3.8, delay: 1.1 },
    { left: 70, top: 25, duration: 4.5, delay: 0.5 },
    { left: 90, top: 70, duration: 3.2, delay: 1.5 },
    { left: 40, top: 90, duration: 4.0, delay: 0.3 },
    { left: 60, top: 45, duration: 3.7, delay: 1.2 },
    { left: 10, top: 60, duration: 4.1, delay: 0.9 },
  ];

  useEffect(() => {
    const minSplashTime = 2000; 
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const elapsed = Date.now() - startTime;
        const minProgress = Math.min((elapsed / minSplashTime) * 100, 90);
        
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            setTimeout(() => {
              onComplete?.();
            }, 500);
          }, 200);
          return 100;
        }
        
        const newProgress = Math.max(prev + Math.random() * 10, minProgress);
        return Math.min(newProgress, 100);
      });
  }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-primary/10 via-background/80 to-primary/20"
          style={{
            height: '100dvh',
            width: '100dvw',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            touchAction: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background/60 to-primary/10 blur-xl opacity-70"></div>
          <div className="relative flex flex-col items-center justify-center space-y-10 px-4">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <Card className="relative w-28 h-28 bg-card/80 backdrop-blur-xl border-2 border-primary/30 shadow-2xl flex items-center justify-center">
                <img 
                  src="/android-chrome-512x512.png" 
                  alt="LaunchTrack Logo" 
                  className="w-16 h-16 object-contain drop-shadow-lg"
                  style={{
                    imageRendering: 'crisp-edges',
                    WebkitImageRendering: 'crisp-edges',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-primary/40 border-t-primary/80 rounded-full pointer-events-none"
                  style={{ boxShadow: '0 0 32px 8px rgba(80,80,255,0.12)' }}
                />
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center space-y-2"
            >
              <h1 className="text-5xl font-extrabold bg-linear-to-r from-primary via-foreground to-primary bg-clip-text text-transparent tracking-tight drop-shadow-lg">
                LaunchTrack
              </h1>
              <Badge variant="secondary" className="text-lg px-5 py-2 rounded-xl shadow-md">
                AI Career Platform
              </Badge>
            </motion.div>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-72 space-y-3"
            >
              <div className="flex justify-between text-base text-muted-foreground font-medium">
                <span>Loading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3 rounded-full bg-primary/10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex items-center space-x-2 text-muted-foreground text-base"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Preparing your experience...</span>
            </motion.div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {particlePositions.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-primary/30 rounded-full shadow-lg"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                  }}
                  animate={{
                    y: [0, -40, 0],
                    opacity: [0.1, 0.7, 0.1],
                    scale: [0.7, 1.3, 0.7],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;