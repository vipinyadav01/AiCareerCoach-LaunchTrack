"use client";

import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { isOnline } from '@/lib/pwa-utils';

export default function PWAStatus() {
  const [online, setOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const currentStatus = isOnline();
      setOnline(currentStatus);
      
      // Show status briefly when it changes
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    // Initial check
    setOnline(isOnline());

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
      online 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center gap-2">
        {online ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {online ? 'Back Online' : 'You\'re Offline'}
        </span>
      </div>
    </div>
  );
}
