'use client';

import { X, Plus, DragDropVerticalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Controller, useFormContext } from 'react-hook-form';

import { AddProductSchema } from '@/api';
import { useDisclosure } from '@/hooks';
import { Button, Checkbox, Input, LocalizedForm, Media, UploadMediaModal } from '@/components';

interface AddProductVariantRowProps {
  index: number;
  onRemove: () => void;
}

export const AddProductVariantRow = ({ index, onRemove }: AddProductVariantRowProps) => {
  const form = useFormContext<AddProductSchema>();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: index });

  const uploadMediaDisclosure = useDisclosure();

  const image = form.watch(`variants.${index}.image`);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b last:border-0 bg-background">
      <td className="p-2 align-middle">
        <Button
          {...attributes}
          {...listeners}
          type="button"
          variant="ghost"
          size="lg"
          className="cursor-grab aria-pressed:cursor-grabbing touch-none"
          icon={<HugeiconsIcon icon={DragDropVerticalIcon} />}
        />
      </td>

      <td className="p-2 align-middle">
        <div className="relative size-16">
          <Button
            type="button"
            variant="outline"
            className="absolute inset-0 h-auto p-0 overflow-hidden"
            onClick={uploadMediaDisclosure.onOpen}
            icon={!image ? <HugeiconsIcon icon={Plus} /> : undefined}
          >
            {image && <Media media={image} alt={`Variant ${index + 1}`} className="w-full h-full object-cover" />}
          </Button>

          <UploadMediaModal
            folder="variant"
            onSuccess={([media]) => {
              form.setValue(`variants.${index}.imageId`, media.id, {
                shouldDirty: true,
                shouldValidate: true,
              });

              form.setValue(`variants.${index}.image`, media, {
                shouldDirty: true,
              });
            }}
            {...uploadMediaDisclosure}
          />
        </div>
      </td>

      <td className="p-2 align-middle">
        <LocalizedForm<AddProductSchema> name={`variants.${index}.name`} hideLabel className="gap-2 text-xs" />
      </td>

      <td className="p-2 align-middle">
        <Controller
          name={`variants.${index}.stock`}
          control={form.control}
          render={({ field }) => (
            <Input
              type="number"
              className="min-h-10 text-lg"
              {...field}
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value) || 0)}
            />
          )}
        />
      </td>

      <td className="p-2 align-middle text-center">
        <Controller
          name={`variants.${index}.isActive`}
          control={form.control}
          render={({ field }) => (
            <div className="flex justify-center pt-2">
              <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
            </div>
          )}
        />
      </td>

      <td className="p-2 align-middle">
        <Controller
          name={`variants.${index}.price`}
          control={form.control}
          render={({ field }) => (
            <Input
              type="number"
              className="min-h-10 text-lg"
              {...field}
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value) || 0)}
            />
          )}
        />
      </td>

      <td className="p-2 align-middle">
        <Controller
          name={`variants.${index}.costPerItem`}
          control={form.control}
          render={({ field }) => (
            <Input
              type="number"
              className="min-h-10 text-lg"
              {...field}
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value) || 0)}
            />
          )}
        />
      </td>

      <td className="p-2 align-middle">
        <Controller
          name={`variants.${index}.compareAt`}
          control={form.control}
          render={({ field }) => (
            <Input
              type="number"
              className="min-h-10 text-lg"
              {...field}
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value) || 0)}
            />
          )}
        />
      </td>

      <td className="p-2 align-middle">
        <Button type="button" variant="ghost" size="lg" onClick={onRemove} icon={<HugeiconsIcon icon={X} />} />
      </td>
    </tr>
  );
};
