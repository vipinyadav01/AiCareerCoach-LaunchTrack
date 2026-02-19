"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = React.memo(({ className }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full",
        className
      )}
    >
      <div className="absolute inset-0 " />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, rgb(229 231 235 / 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgb(229 231 235 / 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
});

BackgroundBeams.displayName = "BackgroundBeams";