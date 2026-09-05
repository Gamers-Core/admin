'use client';

import { useEffect } from 'react';
import { useIsInView } from '@/hooks/useIsInView';

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

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isInView, hasMore, isLoading, onLoadMore]);

  if (!hasMore) return null;

  return <div ref={ref} aria-hidden className="h-px w-full shrink-0" />;
}
