'use client';

import { useId } from 'react';
import { DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { StoreApi, UseBoundStore } from 'zustand';

import { ReorderStore } from '@/stores';

interface UseReorderOptions<T extends { id: number; position: number }> {
  onReorder?: (items: T[]) => void;
}

export const useReorder = <T extends { id: number; position: number }>(
  store: UseBoundStore<StoreApi<ReorderStore<T>>>,
  options: UseReorderOptions<T> = {},
) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const items = store((state) => state.items) ?? [];
  const setItems = store((state) => state.setItems);

  const dndId = useId();

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    setItems(arrayMove(items, oldIndex, newIndex));
    options.onReorder?.(arrayMove(items, oldIndex, newIndex));
  };

  return { sensors, dndId, onDragEnd };
};
