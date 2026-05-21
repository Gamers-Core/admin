'use client';

import { X, Plus, DragDropVerticalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Controller, useFormContext } from 'react-hook-form';

import { ProductSchema } from '@/api';
import { useDisclosure } from '@/hooks';
import { Button, Checkbox, FieldError, Input, LocalizedForm, Media, UploadMediaModal } from '@/components';
import type { ReorderableItemProps } from '@/components';

interface ProductVariantRowProps extends ReorderableItemProps {
  index: number;
  onRemove: () => void;
}

export const ProductVariantRow = ({
  sortable: { containerProps, buttonProps },
  index,
  onRemove,
}: ProductVariantRowProps) => {
  const form = useFormContext<ProductSchema>();

  const uploadMediaDisclosure = useDisclosure();

  const image = form.watch(`variants.${index}.image`);

  return (
    <tr ref={containerProps.ref} style={containerProps.style} className="border-b last:border-0 bg-background">
      <td className="p-2 align-middle">
        <Button
          {...buttonProps}
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
            aria-invalid={Boolean(form.formState.errors.variants?.[index]?.imageId)}
            onClick={uploadMediaDisclosure.onOpen}
            icon={!image ? <HugeiconsIcon icon={Plus} /> : undefined}
          >
            {image && <Media media={image} alt={`Variant ${index + 1}`} className="w-full h-full object-cover" />}
          </Button>

          <UploadMediaModal
            folder="variant"
            onSuccess={([media]) => {
              form.setValue(`variants.${index}.imageId`, media.id, { shouldDirty: true, shouldValidate: true });

              form.setValue(`variants.${index}.image`, media, { shouldDirty: true });
            }}
            {...uploadMediaDisclosure}
          />
        </div>
      </td>

      <td className="p-2 align-middle">
        <LocalizedForm<ProductSchema> name={`variants.${index}.name`} hideLabel className="gap-2 text-xs" />
      </td>

      <td className="p-2 align-middle">
        <VariantNumberInput index={index} name="stock" />
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
        <VariantNumberInput index={index} name="price" />
      </td>

      <td className="p-2 align-middle">
        <VariantNumberInput index={index} name="costPerItem" />
      </td>

      <td className="p-2 align-middle">
        <VariantNumberInput index={index} name="compareAt" />
      </td>

      <td className="p-2 align-middle">
        <Button type="button" variant="ghost" size="lg" onClick={onRemove} icon={<HugeiconsIcon icon={X} />} />
      </td>
    </tr>
  );
};

interface VariantNumberInputProps {
  index: number;
  name: 'stock' | 'price' | 'costPerItem' | 'compareAt';
}

const VariantNumberInput = ({ index, name }: VariantNumberInputProps) => {
  const form = useFormContext<ProductSchema>();

  return (
    <Controller
      name={`variants.${index}.${name}` as const}
      control={form.control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          <Input
            type="number"
            className="min-h-10"
            {...field}
            min={0}
            value={field.value ?? 0}
            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
        </div>
      )}
    />
  );
};
