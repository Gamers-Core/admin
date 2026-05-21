'use client';

import { useState, useCallback, useEffect, useId } from 'react';
import { DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

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
  reset: () => void;
}

interface UseReorderOptions<T> {
  items: T[] | undefined;
  onReorder?: (items: T[]) => void;
  getKey?: (item: T) => string | number;
}

export interface UseReorderReturn<T> {
  dndId: string;
  sensors: ReturnType<typeof useSensors>;
  onDragEnd: (event: DragEndEvent) => void;
  state: ReorderProps<T>;
}

export const useReorder = <T>({
  items: initialItems,
  onReorder,
  getKey,
}: UseReorderOptions<T>): UseReorderReturn<T> => {
  const [items, setItemsState] = useState<T[]>(initialItems ?? []);
  const [originalItems, setOriginalItems] = useState<T[]>(initialItems ?? []);
  const [isReordered, setIsReordered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const dndId = useId();

  const setItems = useCallback(
    (newItems: T[]) => {
      const hasChanged =
        newItems.length !== originalItems.length ||
        newItems.some((item, index) => {
          const originalItem = originalItems[index];

          if (getKey) return getKey(item) !== getKey(originalItem);

          return item !== originalItem;
        });

      setItemsState(newItems);
      setIsReordered(hasChanged);
      onReorder?.(newItems);
    },
    [getKey, onReorder, originalItems],
  );

  const reset = useCallback(() => {
    setItemsState(originalItems);
    setIsReordered(false);
    setIsLoading(false);
  }, [originalItems]);

  const commit = useCallback(
    (newItems?: T[]) => {
      const nextItems = newItems ?? items;

      setItemsState(nextItems);
      setOriginalItems(nextItems);
      setIsReordered(false);

      if (newItems) onReorder?.(newItems);
    },
    [items, onReorder],
  );

  useEffect(() => {
    setItemsState(initialItems ?? []);
    setOriginalItems(initialItems ?? []);
    setIsReordered(false);
    setIsLoading(false);
  }, [initialItems]);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id || !items) return;

      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);

      const reordered = arrayMove(items, oldIndex, newIndex);

      setItems(reordered);
    },
    [items, setItems],
  );

  return {
    dndId,
    sensors,
    onDragEnd,

    state: { items, setItems, isReordered, setIsReordered, isLoading, setIsLoading, commit, reset },
  };
};
