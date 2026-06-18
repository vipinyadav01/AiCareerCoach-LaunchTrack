"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone, Plus, Share, CheckCircle, Sparkles, Zap, Bell, ArrowUp } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showIOSOverlay, setShowIOSOverlay] = useState(false);
  const [installStep, setInstallStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const iOS = /ipad|iphone|ipod/.test(userAgent) && !window.MSStream;
    const android = /android/.test(userAgent);
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

    setIsIOS(iOS);
    setIsAndroid(android);
    setIsMobile(mobile);

    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true
      || document.referrer.includes('android-app://');
    setIsStandalone(standalone);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
        const now = Date.now();
        const threeDays = 3 * 24 * 60 * 60 * 1000;

        if (!dismissed || (dismissedTime && now - parseInt(dismissedTime) > threeDays)) {
          setTimeout(() => {
            setShowInstallPrompt(true);
          }, 3000);
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (iOS && !standalone) {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;

        if (!dismissed || (dismissedTime && now - parseInt(dismissedTime) > oneWeek)) {
          const showAfterInteraction = () => {
            setTimeout(() => {
              setShowInstallPrompt(true);
            }, 5000);

            document.removeEventListener('scroll', showAfterInteraction);
            document.removeEventListener('click', showAfterInteraction);
            document.removeEventListener('touchstart', showAfterInteraction);
          };

          document.addEventListener('scroll', showAfterInteraction, { once: true });
          document.addEventListener('click', showAfterInteraction, { once: true });
          document.addEventListener('touchstart', showAfterInteraction, { once: true });
        }
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSOverlay(true);
      return;
    }

    if (deferredPrompt) {
      setInstallStep(1);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          setShowSuccess(true);
          setTimeout(() => {
            setDeferredPrompt(null);
            setShowInstallPrompt(false);
            setInstallStep(0);
            setShowSuccess(false);
          }, 2500);
        } else {
          setInstallStep(0);
        }
      } catch (error) {
        console.error('Install prompt error:', error);
        setInstallStep(0);
      }
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setShowIOSOverlay(false);
    setInstallStep(0);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', 'true');
      localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
    }
  };

  if (isStandalone || !showInstallPrompt) {
    return null;
  }

  return (
    <>
      {/* Mobile Layout - iOS Style */}
      {isIOS && (
        <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
          <div className="bg-white/95 dark:bg-black/95 backdrop-blur-lg border-t border-black/20 dark:border-white/20 shadow-2xl">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-md">
                    <Download className="h-5 w-5 text-white dark:text-black" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-black dark:text-white">
                      Add to Home Screen
                    </h3>
                    <p className="text-xs text-black/60 dark:text-white/60">
                      Quick access to this app
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    onClick={() => setShowIOSOverlay(true)}
                    size="sm"
                    className="font-semibold px-4 py-1.5 rounded-lg text-sm bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black h-auto"
                  >
                    Add
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white rounded-md"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Layout - Android Style */}
      {isAndroid && (
        <div className="fixed inset-x-0 bottom-0 z-50 md:hidden animate-in slide-in-from-bottom duration-300">
          <div className="bg-white dark:bg-black border-t border-black/20 dark:border-white/20 shadow-2xl">
            <div className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                    <Download className="h-5 w-5 text-white dark:text-black" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-black dark:text-white leading-tight">
                    Install app
                  </h3>
                  <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">
                    Get offline access & notifications
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    onClick={handleInstallClick}
                    disabled={installStep === 1}
                    size="sm"
                    className="font-semibold px-3 py-1.5 rounded-lg text-xs bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black h-auto"
                  >
                    {installStep === 1 ? 'Installing...' : 'Install'}
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white rounded-md"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <Card className="w-80 border border-black/20 dark:border-white/20 bg-white dark:bg-black shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-lg">
                  <Download className="h-6 w-6 text-white dark:text-black" />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-base text-black dark:text-white mb-1">
                    Install App
                  </h3>
                  <p className="text-xs text-black/60 dark:text-white/60">
                    Add to your device for quick access
                  </p>
                </div>

                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="shrink-0 h-6 w-6 p-0 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white rounded-md"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 mb-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="h-3.5 w-3.5 text-black dark:text-white" />
                  <span className="text-black dark:text-white">Fast, offline-ready</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Bell className="h-3.5 w-3.5 text-black dark:text-white" />
                  <span className="text-black dark:text-white">Push notifications</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Smartphone className="h-3.5 w-3.5 text-black dark:text-white" />
                  <span className="text-black dark:text-white">Native experience</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  disabled={installStep === 1}
                  className="flex-1 font-semibold px-4 py-2 rounded-lg text-sm bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black h-auto"
                >
                  {installStep === 1 ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white dark:border-black border-t-transparent mr-2"></div>
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Install
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 h-auto"
                >
                  Later
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* iOS Instruction Overlay */}
      {isIOS && showIOSOverlay && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center p-4 md:hidden animate-in fade-in duration-200">
          <div className="bg-white dark:bg-black rounded-t-3xl w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-3xl bg-black dark:bg-white flex items-center justify-center shadow-lg">
                  <Share className="h-6 w-6 text-white dark:text-black" />
                </div>
                <h3 className="font-bold text-lg text-black dark:text-white mb-1">
                  Add to Home Screen
                </h3>
                <p className="text-xs text-black/60 dark:text-white/60">
                  Get instant access to the app
                </p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                  <div className="w-7 h-7 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-black dark:text-white">Tap the Share button</p>
                    <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">Look for the square with an arrow at the bottom</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                  <div className="w-7 h-7 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-black dark:text-white">Select "Add to Home Screen"</p>
                    <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">Scroll down if you don't see it immediately</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                  <div className="w-7 h-7 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-black dark:text-white">Tap "Add"</p>
                    <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">The app will be added to your home screen</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleDismiss}
                  className="flex-1 font-semibold py-2.5 rounded-lg bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black"
                >
                  Done
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="flex-1 py-2.5 rounded-lg border border-black/20 dark:border-white/20 text-black dark:text-white font-medium"
                >
                  Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-black rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black dark:bg-white flex items-center justify-center shadow-lg">
              <CheckCircle className="h-8 w-8 text-white dark:text-black" />
            </div>
            <h3 className="font-bold text-lg text-black dark:text-white mb-1">
              Installation Complete!
            </h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">
              The app is now installed. Find it on your home screen or app drawer.
            </p>
            <Button
              onClick={handleDismiss}
              className="font-semibold px-6 py-2 rounded-lg bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </>
  );
}