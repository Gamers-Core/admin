'use client';

import { useEffect, useRef } from 'react';

import { useIsInView } from '@/hooks';

interface InfiniteScrollTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  root?: Element | null;
  rootMargin?: string;
}

export function InfiniteScrollTrigger({
  onLoadMore,
  hasMore,
  isLoading,
  root = null,
  rootMargin = '200px',
}: InfiniteScrollTriggerProps) {
  const [ref, isInView] = useIsInView<HTMLDivElement>({ root, rootMargin });

  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!isInView) {
      hasTriggeredRef.current = false;
      return;
    }

    if (hasMore && !isLoading && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      onLoadMore();
    }
  }, [isInView, hasMore, isLoading, onLoadMore]);

  if (!hasMore) return null;

  return <div ref={ref} aria-hidden className="size-px shrink-0" />;
}
