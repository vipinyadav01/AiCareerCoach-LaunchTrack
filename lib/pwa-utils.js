"use client";

// PWA Utilities for LaunchTrack

export const isPWAInstalled = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  );
};

export const isOnline = () => {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  } else {
    throw new Error('Service Worker not supported');
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/android-chrome-192x192.png',
      badge: '/android-chrome-192x192.png',
      ...options,
    });
  }
};

export const addToHomeScreen = (deferredPrompt) => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    return deferredPrompt.userChoice;
  }
  return Promise.reject('No install prompt available');
};

// PWA Analytics helper
export const trackPWAUsage = (event, data = {}) => {
  // You can integrate with your analytics service here
  console.log('PWA Event:', event, data);
  
  // Example: Track if user is using PWA or browser
  if (isPWAInstalled()) {
    console.log('User is using PWA');
  } else {
    console.log('User is using browser');
  }
};

// Background sync helper
export const scheduleBackgroundSync = (tag) => {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.sync.register(tag);
    });
  }
};

// Cache management
export const clearPWACache = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  }
};

// Check for app updates
export const checkForAppUpdates = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
};
