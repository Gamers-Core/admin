'use client';

import { useCallback, useId, type ReactNode } from 'react';
import {
  DndContext,
  type CollisionDetection,
  closestCenter,
  type UniqueIdentifier,
  type DraggableAttributes,
  useSensor,
  PointerSensor,
  TouchSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  type SortingStrategy,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useReorder, type UseReorderOptions, type ReorderProps } from '@/hooks';

export interface SortableItemProps {
  containerProps: {
    ref: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
  };
  buttonProps: DraggableAttributes;
}

export interface ReorderableItemProps {
  sortable: SortableItemProps;
}

interface ReorderListProps<T> extends UseReorderOptions<T> {
  disabled?: boolean;
  strategy?: SortingStrategy;
  collisionDetection?: CollisionDetection;
  renderItem: (item: T, sortable: SortableItemProps, index: number, state: ReorderProps<T>) => ReactNode;
  renderContainer?: (children: ReactNode) => ReactNode;
  renderEmpty?: (state: ReorderProps<T>) => ReactNode;
  children?: (content: ReactNode, state: ReorderProps<T>) => ReactNode;
}

export const ReorderList = <T,>({
  items,
  onReorder,
  getKey,
  disabled,
  strategy = verticalListSortingStrategy,
  collisionDetection = closestCenter,
  renderItem,
  renderContainer,
  renderEmpty,
  children,
}: ReorderListProps<T>) => {
  const state = useReorder({ items, onReorder, getKey });

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id || !items) return;

      const oldIndex = items.findIndex((item) => state.getItemId(item) === active.id);
      const newIndex = items.findIndex((item) => state.getItemId(item) === over.id);

      if (oldIndex < 0 || newIndex < 0) return;

      const reordered = arrayMove(items, oldIndex, newIndex);

      state.setItems(reordered);
    },
    [items, state],
  );

  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const listItems = state.items.map((item, index) => (
    <ReorderItem
      key={state.getItemId(item)}
      id={state.getItemId(item)}
      render={(sortable) => renderItem(item, sortable, index, state)}
    />
  ));

  const container = renderContainer ? renderContainer(listItems) : listItems;

  const isDisabled = disabled ?? state.isLoading;

  const content = state.items.length ? (
    <DndContext id={dndId} sensors={sensors} collisionDetection={collisionDetection} onDragEnd={onDragEnd}>
      <SortableContext
        disabled={isDisabled}
        items={state.items.map((item) => state.getItemId(item))}
        strategy={strategy}
      >
        {container}
      </SortableContext>
    </DndContext>
  ) : (
    (renderEmpty?.(state) ?? null)
  );

  if (children) return children(content, state);

  return content;
};

interface ReorderItemProps {
  id: UniqueIdentifier;
  render: (sortable: SortableItemProps) => ReactNode;
}

const ReorderItem = ({ id, render }: ReorderItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return render({
    buttonProps: { ...attributes, ...listeners },
    containerProps: { ref: setNodeRef, style: { transform: CSS.Transform.toString(transform), transition } },
  });
};
