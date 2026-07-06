"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUp, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ==========================================
// ScrollToTop Component
// ==========================================
export function ScrollToTop() {
  const [show, setShow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = windowHeight > 0 ? (scrollY / windowHeight) * 100 : 0;

    setShow(scrollY > 400);
    setScrollProgress(Math.min(progress, 100));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Progress Ring */}
          <div className="relative">
            {/* Background Ring */}
            <svg
              className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90"
              viewBox="0 0 56 56"
            >
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted/20"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
                className="text-school-blue transition-all duration-300"
              />
            </svg>

            {/* Button */}
            <button
              onClick={scrollToTop}
              className={cn(
                "relative flex items-center justify-center",
                "h-11 w-11 rounded-full",
                "bg-primary text-primary-foreground",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-200",
                "hover:scale-110 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue focus-visible:ring-offset-2",
                "group"
              )}
              aria-label="Scroll to top"
              title="Back to top"
            >
              <ArrowUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}