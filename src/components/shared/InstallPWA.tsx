"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, School, Smartphone, Monitor, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type InstallPlatform = "native" | "ios" | "android" | "desktop";

// ==========================================
// InstallPWA Component
// ==========================================
export function InstallPWA() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<InstallPlatform>("native");
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  // Detect platform
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) {
      setPlatform("ios");
    } else if (/Android/.test(ua)) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }
  }, []);

  // Check if already installed (standalone mode)
  const isStandalone = typeof window !== "undefined" && 
    (window.matchMedia("(display-mode: standalone)").matches || 
     (navigator as any).standalone);

  useEffect(() => {
    // Don't show if already installed
    if (isStandalone) return;

    // Don't show if previously dismissed
    const dismissedTime = localStorage.getItem("pwaInstallDismissed");
    if (dismissedTime) {
      const diff = Date.now() - parseInt(dismissedTime);
      // Show again after 7 days
      if (diff < 7 * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Delay showing for better UX
      const timer = setTimeout(() => {
        if (!dismissed) setShow(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Show custom prompt for iOS
    if (platform === "ios" && !isStandalone) {
      const timer = setTimeout(() => {
        if (!dismissed) setShow(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [platform, isStandalone, dismissed]);

  // Handle Install
  const handleInstall = useCallback(async () => {
    if (platform === "ios") {
      // iOS: Show instructions
      setShow(false);
      return;
    }

    if (!deferredPrompt) return;

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        console.log("✅ PWA installed");
        setShow(false);
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error("PWA install failed:", error);
    } finally {
      setInstalling(false);
    }
  }, [deferredPrompt, platform]);

  // Handle Dismiss
  const handleDismiss = useCallback(() => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("pwaInstallDismissed", Date.now().toString());
  }, []);

  // Don't render if already standalone
  if (isStandalone) return null;

  const platformIcon = {
    native: <Download className="h-5 w-5" />,
    ios: <Share2 className="h-5 w-5" />,
    android: <Smartphone className="h-5 w-5" />,
    desktop: <Monitor className="h-5 w-5" />,
  };

  const installText = {
    native: "Install App",
    ios: 'Tap Share then "Add to Home Screen"',
    android: "Install App",
    desktop: "Install App",
  };

  const buttonText = {
    native: installing ? "Installing..." : "Install",
    ios: "Got it",
    android: installing ? "Installing..." : "Install",
    desktop: installing ? "Installing..." : "Install",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <div className="glass-card p-4 shadow-2xl border border-border">
            <div className="flex items-start gap-3">
              {/* App Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-md">
                <School className="h-5 w-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold">Afridi Model School</h4>
                  <button
                    onClick={handleDismiss}
                    className="p-1 rounded-md hover:bg-muted transition-colors shrink-0"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-0.5">
                  Install for quick access and offline use
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    disabled={installing}
                    className="flex-1 gap-1.5"
                  >
                    {platformIcon[platform]}
                    <span className="text-xs">{buttonText[platform]}</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismiss}
                    className="text-xs"
                  >
                    Later
                  </Button>
                </div>

                {/* iOS Instructions */}
                {platform === "ios" && (
                  <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                    Tap the Share button in Safari and select &ldquo;Add to Home Screen&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}