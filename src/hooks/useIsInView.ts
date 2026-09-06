'use client';

import { useState, useRef, RefObject, useEffect } from 'react';

interface UseIsInViewOptions extends IntersectionObserverInit {
  isInView?: boolean;
}

export const useIsInView = <T extends HTMLElement = HTMLDivElement>(
  options: UseIsInViewOptions = {},
): [RefObject<T | null>, boolean] => {
  const { threshold = 0, root = null, rootMargin = '0px', isInView: initialIsInView = false } = options;

  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(initialIsInView);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold, root, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin]);

  return [ref, isInView];
};
