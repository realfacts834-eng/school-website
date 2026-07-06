"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cookie, X, Settings, ChevronDown, Shield, BarChart3, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
type ConsentType = "all" | "essential" | "custom" | null;

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

// ==========================================
// CookieConsent Component
// ==========================================
export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always enabled
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Delay showing for better UX
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = useCallback((type: ConsentType, prefs?: CookiePreferences) => {
    const data = {
      type,
      preferences: prefs || preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(data));
    setShow(false);

    // Optional: Send to analytics
    // trackEvent("cookie_consent", { type });
  }, [preferences]);

  const acceptAll = () => saveConsent("all", {
    essential: true,
    analytics: true,
    marketing: true,
  });

  const acceptEssential = () => saveConsent("essential", {
    essential: true,
    analytics: false,
    marketing: false,
  });

  const acceptCustom = () => saveConsent("custom", preferences);

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "essential") return; // Can't toggle essential
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md md:max-w-lg mx-auto"
        >
          <div className="glass-card p-5 md:p-6 shadow-2xl border border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Cookie className="h-4 w-4 text-primary" />
                </div>
                <h4 className="text-sm font-bold">Cookie Settings</h4>
              </div>
              <button
                onClick={acceptEssential}
                className="p-1 rounded-md hover:bg-muted transition-colors"
                aria-label="Close and accept essential only"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              We use cookies to improve your experience, analyze site usage, and 
              deliver relevant content.{" "}
              <Link
                href="/privacy-policy"
                className="text-primary hover:underline font-medium"
              >
                Learn more
              </Link>
            </p>

            {/* Details Toggle */}
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 mb-4"
              >
                {/* Essential */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2.5">
                    <Shield className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xs font-semibold">Essential</p>
                      <p className="text-[10px] text-muted-foreground">
                        Required for the website to function
                      </p>
                    </div>
                  </div>
                  <div className="w-9 h-5 rounded-full bg-green-500 flex items-center px-0.5">
                    <div className="w-4 h-4 rounded-full bg-white ml-auto" />
                  </div>
                </div>

                {/* Analytics */}
                <div
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors",
                    preferences.analytics ? "bg-muted/30" : "bg-muted/10"
                  )}
                  onClick={() => togglePreference("analytics")}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs font-semibold">Analytics</p>
                      <p className="text-[10px] text-muted-foreground">
                        Help us improve our website
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-9 h-5 rounded-full flex items-center px-0.5 transition-colors",
                      preferences.analytics ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full bg-white transition-transform",
                        preferences.analytics ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </div>
                </div>

                {/* Marketing */}
                <div
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors",
                    preferences.marketing ? "bg-muted/30" : "bg-muted/10"
                  )}
                  onClick={() => togglePreference("marketing")}
                >
                  <div className="flex items-center gap-2.5">
                    <Target className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs font-semibold">Marketing</p>
                      <p className="text-[10px] text-muted-foreground">
                        Personalized content and offers
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-9 h-5 rounded-full flex items-center px-0.5 transition-colors",
                      preferences.marketing ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full bg-white transition-transform",
                        preferences.marketing ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Customize Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <Settings className="h-3 w-3" />
              {showDetails ? "Hide details" : "Customize"}
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform",
                  showDetails && "rotate-180"
                )}
              />
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" onClick={acceptAll} className="flex-1">
                Accept All
              </Button>
              {showDetails && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={acceptCustom}
                  className="flex-1"
                >
                  Save Preferences
                </Button>
              )}
              {!showDetails && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={acceptEssential}
                  className="flex-1"
                >
                  Essential Only
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}