"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

// ==========================================
// Tailwind Breakpoints (in pixels)
// ==========================================
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// ==========================================
// useMediaQuery Hook (with SSR support)
// ==========================================
export function useMediaQuery(query: string): boolean {
  // Server-side safe initial value
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {};

      const mediaQuery = window.matchMedia(query);

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", callback);
        return () => mediaQuery.removeEventListener("change", callback);
      }
      // Fallback
      else {
        mediaQuery.addListener(callback);
        return () => mediaQuery.removeListener(callback);
      }
    },
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

// ==========================================
// Ready-made Breakpoint Hooks
// ==========================================
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
}

export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`
  );
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

export function useIsLargeDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
}

// ==========================================
// Custom Breakpoint Hooks
// ==========================================
export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS): boolean {
  const width = BREAKPOINTS[breakpoint];
  return useMediaQuery(`(min-width: ${width}px)`);
}

export function useBreakpointDown(breakpoint: keyof typeof BREAKPOINTS): boolean {
  const width = BREAKPOINTS[breakpoint];
  return useMediaQuery(`(max-width: ${width - 1}px)`);
}

export function useBreakpointBetween(
  min: keyof typeof BREAKPOINTS,
  max: keyof typeof BREAKPOINTS
): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS[min]}px) and (max-width: ${BREAKPOINTS[max] - 1}px)`
  );
}

// ==========================================
// Device Detection Hooks
// ==========================================
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  }, []);

  return isTouch;
}

export function useIsIOS(): boolean {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  }, []);

  return isIOS;
}

export function useIsAndroid(): boolean {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    setIsAndroid(/Android/.test(navigator.userAgent));
  }, []);

  return isAndroid;
}

// ==========================================
// Color Scheme & Preferences
// ==========================================
export function useColorScheme(): "light" | "dark" | "no-preference" {
  const [scheme, setScheme] = useState<"light" | "dark" | "no-preference">("no-preference");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateScheme = () => {
      setScheme(mediaQuery.matches ? "dark" : "light");
    };

    updateScheme();
    mediaQuery.addEventListener("change", updateScheme);
    return () => mediaQuery.removeEventListener("change", updateScheme);
  }, []);

  return scheme;
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useHighContrast(): boolean {
  return useMediaQuery("(prefers-contrast: high)");
}

// ==========================================
// Window Size Hook
// ==========================================
interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return size;
}