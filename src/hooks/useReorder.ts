'use client';
import { useState, useCallback, useEffect, useRef } from 'react';

export interface ReorderState<T> {
  items: T[];
  isReordered: boolean;
  isLoading: boolean;
}

export interface ReorderProps<T> extends ReorderState<T> {
  setItems: (items: T[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsReordered: (isReordered: boolean) => void;
  commit: (items?: T[]) => void;
  getItemId: (item: T) => string | number;
  reset: () => void;
}

export interface UseReorderOptions<T> {
  items: T[] | undefined;
  onReorder?: (items: T[]) => void;
  getKey?: (item: T) => string | number;
}

export const useReorder = <T>({ items: initialItems, onReorder, getKey }: UseReorderOptions<T>): ReorderProps<T> => {
  const [items, setItemsState] = useState<T[]>(initialItems ?? []);
  const [isReordered, setIsReordered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const originalItemsRef = useRef<T[]>(initialItems ?? []);
  const generatedIdsRef = useRef(new WeakMap<object, string>());
  const generatedIdCounterRef = useRef(0);

  const getItemId = useCallback(
    (item: T) => {
      if (getKey) return getKey(item);

      if (typeof item === 'string' || typeof item === 'number') return item;

      if (item && typeof item === 'object') {
        if ('id' in item) {
          const candidate = (item as { id?: unknown }).id;

          if (typeof candidate === 'string' || typeof candidate === 'number') return candidate;
        }

        const map = generatedIdsRef.current;

        if (!map.has(item)) map.set(item, `dnd-${generatedIdCounterRef.current++}`);

        return map.get(item) as string;
      }

      return String(item);
    },
    [getKey],
  );

  const setItems = useCallback(
    (newItems: T[]) => {
      const original = originalItemsRef.current;
      const hasChanged =
        newItems.length !== original.length ||
        newItems.some((item, index) => {
          const originalItem = original[index];

          if (getKey) return getKey(item) !== getKey(originalItem);

          return item !== originalItem;
        });

      setItemsState(newItems);
      setIsReordered(hasChanged);
      onReorder?.(newItems);
    },
    [getKey, onReorder],
  );

  const reset = useCallback(() => {
    setItemsState(originalItemsRef.current);
    setIsReordered(false);
    setIsLoading(false);
  }, []);

  const commit = useCallback(
    (newItems?: T[]) => {
      const nextItems = newItems ?? items;

      setItemsState(nextItems);

      originalItemsRef.current = nextItems;

      setIsReordered(false);

      if (newItems) onReorder?.(newItems);
    },
    [items, onReorder],
  );

  useEffect(() => {
    setItemsState(initialItems ?? []);
    originalItemsRef.current = initialItems ?? [];
    setIsReordered(false);
    setIsLoading(false);
  }, [initialItems]);

  return { items, setItems, isReordered, setIsReordered, isLoading, setIsLoading, commit, getItemId, reset };
};
