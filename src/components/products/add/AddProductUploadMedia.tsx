'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import { DragDropVerticalIcon, X } from '@hugeicons/core-free-icons';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { AddProductSchema, MediaByFolder } from '@/api';
import { Button, Field, FieldError, Media, UploadMediaModal } from '@/components';
import { useDisclosure, useReorder } from '@/hooks';
import { useProductsMediaReorderStore } from '@/stores';

export const AddProductUploadMedia = () => {
  const form = useFormContext<AddProductSchema>();
  const uploadMediaDisclosure = useDisclosure();

  const media = useProductsMediaReorderStore((state) => state.items) ?? [];
  const setMedia = useProductsMediaReorderStore((state) => state.setItems);

  const setMediaIds = (items: typeof media) =>
    form.setValue(
      'mediaIds',
      items.map((m) => m.id),
      { shouldDirty: true },
    );

  const updateMedia = (items: typeof media) => {
    setMedia(items);
    setMediaIds(items);
  };

  const { dndId, onDragEnd, sensors } = useReorder(useProductsMediaReorderStore, { onReorder: setMediaIds });

  return (
    <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-4 min-h-44">
      <div className="flex justify-between gap-2">
        <h3 className="text-lg font-semibold">Media</h3>

        <Button size="sm" variant="outline" onClick={uploadMediaDisclosure.onOpen}>
          Add Media
        </Button>
      </div>

      {media.length > 0 ? (
        <Controller
          name="mediaIds"
          control={form.control}
          render={({ fieldState }) => (
            <Field>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-4">
                <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext items={media.map(({ id }) => id)} strategy={rectSortingStrategy}>
                    {media.map((m) => (
                      <MediaCard
                        {...m}
                        key={m.id}
                        onRemove={() => updateMedia(media.filter((item) => item.id !== m.id))}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </ul>

              {fieldState.invalid && (
                <FieldError className="text-sm/normal lg:text-sm/relaxed" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      ) : (
        <p className="text-sm text-muted-foreground m-auto">No media added yet.</p>
      )}

      <UploadMediaModal
        folder="product"
        onSuccess={(newMedia) =>
          updateMedia([...media, ...newMedia.map((m, i) => ({ ...m, position: media.length + i }))])
        }
        {...uploadMediaDisclosure}
      />
    </section>
  );
};

interface MediaCardProps extends MediaByFolder<'product'> {
  onRemove: () => void;
}

const MediaCard = ({ onRemove, ...media }: MediaCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: media.id });

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

      <div className="lg:absolute inset-0 lg:bg-black bg-opacity-50 flex flex-col items-center justify-between gap-2 p-4 lg:opacity-0 hover:opacity-100 transition-opacity rounded-lg">
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
