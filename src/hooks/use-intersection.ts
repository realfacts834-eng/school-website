"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ==========================================
// Types
// ==========================================
interface UseIntersectionOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
  initialIsIntersecting?: boolean;
}

interface UseIntersectionReturn {
  ref: (node: Element | null) => void;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
  observer: IntersectionObserver | null;
}

// ==========================================
// useIntersection Hook
// ==========================================
export function useIntersection(
  options: UseIntersectionOptions = {}
): UseIntersectionReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0px",
    triggerOnce = false,
    initialIsIntersecting = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggered = useRef(false);

  // Create callback ref
  const ref = useCallback((node: Element | null) => {
    setNode(node);
  }, []);

  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!node) return;

    // Don't observe if already triggered once
    if (triggerOnce && hasTriggered.current) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        // If trigger once and intersecting, unobserve
        if (entry.isIntersecting && triggerOnce) {
          hasTriggered.current = true;
          observer.unobserve(node);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(node);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [node, threshold, root, rootMargin, triggerOnce]);

  return {
    ref,
    isIntersecting,
    entry,
    observer: observerRef.current,
  };
}

// ==========================================
// useInView Hook (Simplified)
// ==========================================
export function useInView(
  options: UseIntersectionOptions = {}
): [ReturnType<typeof useCallback>, boolean] {
  const { ref, isIntersecting } = useIntersection({
    threshold: 0.1,
    triggerOnce: true,
    ...options,
  });

  return [ref, isIntersecting];
}

// ==========================================
// useLazyLoad Hook (For images)
// ==========================================
export function useLazyLoad(
  options: UseIntersectionOptions = {}
): {
  ref: (node: Element | null) => void;
  shouldLoad: boolean;
} {
  const { ref, isIntersecting } = useIntersection({
    threshold: 0,
    rootMargin: "200px", // Load 200px before visible
    triggerOnce: true,
    ...options,
  });

  return { ref, shouldLoad: isIntersecting };
}