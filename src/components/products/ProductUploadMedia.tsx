'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import { DragDropVerticalIcon, Plus, X } from '@hugeicons/core-free-icons';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ProductSchema, MediaByFolder } from '@/api';
import { Button, Field, FieldError, Media, UploadMediaModal } from '@/components';
import { useDisclosure, useReorder } from '@/hooks';

export const ProductUploadMedia = () => {
  const form = useFormContext<ProductSchema>();
  const uploadMediaDisclosure = useDisclosure();

  const { onDragEnd, sensors, state } = useReorder({
    items: form.watch('media'),
    onReorder: (items) => form.setValue('media', items, { shouldDirty: true, shouldValidate: true }),
  });

  return (
    <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-4 min-h-44">
      <div className="flex justify-between gap-2">
        <h3 className="text-lg font-semibold">Media</h3>

        <Button size="sm" variant="outline" icon={<HugeiconsIcon icon={Plus} />} onClick={uploadMediaDisclosure.onOpen}>
          Add Media
        </Button>
      </div>

      <Controller
        name="media"
        control={form.control}
        render={({ fieldState }) => (
          <>
            <Field className="flex-1">
              {state.items.length > 0 ? (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-4">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                    <SortableContext items={state.items.map((_, index) => index)} strategy={rectSortingStrategy}>
                      {state.items.map((m, index) => (
                        <MediaCard
                          {...m}
                          key={m.id}
                          index={index}
                          onRemove={() => state.setItems(state.items.filter((_, i) => i !== index))}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center m-auto">No media added yet.</p>
              )}

              {fieldState.invalid && (
                <FieldError className="text-sm/normal lg:text-sm/relaxed" errors={[fieldState.error]} />
              )}
            </Field>

            <UploadMediaModal
              folder="product"
              onSuccess={(newMedia) => state.setItems([...state.items, ...newMedia])}
              {...uploadMediaDisclosure}
            />
          </>
        )}
      />
    </section>
  );
};

interface MediaCardProps extends MediaByFolder<'product'> {
  index: number;
  onRemove: () => void;
}

const MediaCard = ({ index, onRemove, ...media }: MediaCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: index });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      key={media.id}
      className="relative"
    >
      <Media
        media={media}
        alt={`Product Media ${media.id}`}
        className="w-full aspect-square object-cover overflow-hidden rounded-lg"
      />

      <div className="lg:absolute inset-0 lg:bg-black bg-opacity-50 flex flex-col items-center justify-between gap-2 py-4 px-3 lg:opacity-0 hover:opacity-100 transition-opacity rounded-lg">
        <p className="text-xs">
          {media.type}/{media.format}
        </p>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" icon={<HugeiconsIcon icon={X} className="size-3" />} onClick={onRemove} />

          <Button
            {...attributes}
            {...listeners}
            size="sm"
            className="cursor-grab aria-pressed:cursor-grabbing touch-none"
            variant="outline"
            icon={<HugeiconsIcon icon={DragDropVerticalIcon} className="size-3" />}
          />
        </div>
      </div>
    </li>
  );
};
