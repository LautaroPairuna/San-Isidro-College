// src/lib/hooks/useInfiniteCarousel.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface Options {
  totalSlides: number;
  intervalMs?: number;
}

export function useInfiniteCarousel({
  totalSlides,
  intervalMs = 5000
}: Options) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitionEnabled, setTE] = useState(true);
  const isAnimatingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const next = useCallback(() => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      setIndex(i => i + 1);
    }
  }, []);

  const prev = useCallback(() => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      setIndex(i => i - 1);
    }
  }, []);

  const goTo = useCallback((n: number) => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      setIndex(n);
    }
  }, []);

  // Auto-advance
  useEffect(() => {
    if (isPaused || totalSlides === 0) return;
    intervalRef.current = setInterval(next, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, totalSlides, intervalMs, next]);

  // Loop normalization
  const handleTransitionEnd = useCallback(() => {
    let newIndex = index;
    if (index >= totalSlides)      newIndex = index - totalSlides;
    else if (index < 0)            newIndex = index + totalSlides;

    setIndex(newIndex);
    isAnimatingRef.current = false;
  }, [index, totalSlides]);

  // Reactivar transición si estaba deshabilitada
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isTransitionEnabled) {
      timeoutId = setTimeout(() => setTE(true), 50);
    }
    // Siempre devolvemos función de limpieza
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isTransitionEnabled]);

  return {
    index,
    isTransitionEnabled,
    pause:   () => setIsPaused(true),
    resume:  () => setIsPaused(false),
    next,
    prev,
    goTo,
    handleTransitionEnd,
  };
}
