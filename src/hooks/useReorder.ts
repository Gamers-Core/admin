'use client';

import { useState, useCallback, useEffect, useId } from 'react';
import { DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export interface ReorderState<T> {
  items: T[] | null;
  isReordered: boolean;
  isLoading: boolean;
}

export interface ReorderProps<T> extends ReorderState<T> {
  setItems: (items: T[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsReordered: (isReordered: boolean) => void;
  reset: () => void;
}

interface UseReorderOptions<T> {
  items: T[] | undefined;
  onReorder?: (items: T[]) => void;
}

export interface UseReorderReturn<T> {
  dndId: string;
  sensors: ReturnType<typeof useSensors>;
  onDragEnd: (event: DragEndEvent) => void;
  state: ReorderProps<T>;
}

export const useReorder = <T>({ items: initialItems, onReorder }: UseReorderOptions<T>): UseReorderReturn<T> => {
  const [items, setItemsState] = useState<T[] | null>(initialItems ?? null);
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
        newItems.length !== originalItems.length || newItems.some((item, index) => item !== originalItems[index]);

      setItemsState(newItems);
      setIsReordered(hasChanged);
    },
    [originalItems],
  );

  const reset = useCallback(() => {
    setItemsState(originalItems);
    setIsReordered(false);
    setIsLoading(false);
  }, [originalItems]);

  useEffect(() => {
    setItemsState(initialItems ?? null);
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
      onReorder?.(reordered);
    },
    [items, setItems, onReorder],
  );

  return {
    dndId,
    sensors,
    onDragEnd,

    state: { items, setItems, isReordered, setIsReordered, isLoading, setIsLoading, reset },
  };
};
