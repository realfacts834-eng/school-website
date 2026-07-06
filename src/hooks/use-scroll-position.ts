"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ==========================================
// Types
// ==========================================
interface ScrollPosition {
  x: number;
  y: number;
  scrollPercentage: number;
}

interface ScrollDirection {
  direction: "up" | "down" | "none";
  isScrollingUp: boolean;
  isScrollingDown: boolean;
}

// ==========================================
// useScrollPosition Hook
// ==========================================
export function useScrollPosition(
  throttleMs: number = 100
): {
  scrollPosition: number;
  isScrolled: boolean;
  scrollData: ScrollPosition;
  scrollDirection: ScrollDirection;
} {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollData, setScrollData] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    scrollPercentage: 0,
  });
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>({
    direction: "none",
    isScrollingUp: false,
    isScrollingDown: false,
  });

  const lastScrollY = useRef(0);
  const lastDirection = useRef<"up" | "down" | "none">("none");
  const throttleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Throttle
      if (throttleTimeout.current) return;

      throttleTimeout.current = setTimeout(() => {
        throttleTimeout.current = null;

        const currentY = window.scrollY;
        const currentX = window.scrollX;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = docHeight > 0 ? Math.round((currentY / docHeight) * 100) : 0;

        // Scroll Y
        setScrollY(currentY);
        setIsScrolled(currentY > 50);

        // Full scroll data
        setScrollData({
          x: currentX,
          y: currentY,
          scrollPercentage: Math.min(percentage, 100),
        });

        // Direction
        const direction: "up" | "down" | "none" =
          currentY > lastScrollY.current
            ? "down"
            : currentY < lastScrollY.current
              ? "up"
              : "none";

        if (direction !== lastDirection.current) {
          setScrollDirection({
            direction,
            isScrollingUp: direction === "up",
            isScrollingDown: direction === "down",
          });
          lastDirection.current = direction;
        }

        lastScrollY.current = currentY;
      }, throttleMs);
    };

    // Initial call
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, [throttleMs]);

  return { scrollPosition: scrollY, isScrolled, scrollData, scrollDirection };
}

// ==========================================
// useScrollDirection Hook
// ==========================================
export function useScrollDirection(): ScrollDirection {
  const { scrollDirection } = useScrollPosition();
  return scrollDirection;
}

// ==========================================
// useScrollProgress Hook
// ==========================================
export function useScrollProgress(): number {
  const { scrollData } = useScrollPosition();
  return scrollData.scrollPercentage;
}

// ==========================================
// useScrollTo Hook
// ==========================================
export function useScrollTo() {
  const scrollTo = useCallback(
    (
      target: number | string | Element,
      options: ScrollIntoViewOptions & { offset?: number } = {}
    ) => {
      const { offset = 0, behavior = "smooth", ...scrollOptions } = options;

      if (typeof target === "number") {
        window.scrollTo({
          top: target + offset,
          behavior,
        });
      } else if (target instanceof Element) {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior });
      } else if (typeof target === "string") {
        const element = document.querySelector(target);
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior });
        }
      }
    },
    []
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  return { scrollTo, scrollToTop, scrollToBottom };
}

// ==========================================
// useScrollLock Hook
// ==========================================
export function useScrollLock(lock: boolean = true) {
  useEffect(() => {
    if (!lock) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [lock]);
}

// ==========================================
// useScrollSpy Hook
// ==========================================
export function useScrollSpy(
  sectionIds: string[],
  offset: number = 100
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollY) {
          setActiveId(sectionIds[i]);
          return;
        }
      }

      setActiveId(sectionIds[0] || null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeId;
}