'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { DragDropVerticalIcon, Plus, X } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { ProductSchema } from '@/api';
import { useDisclosure } from '@/hooks';
import {
  Button,
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
  Input,
  LocalizedForm,
  Media,
  Switch,
  UploadMediaModal,
} from '@/components';

import type { ReorderableItemProps } from '@/components';

interface ProductVariantCardProps extends ReorderableItemProps {
  index: number;
  onRemove: () => void;
}

export const ProductVariantCard = ({
  sortable: { containerProps, buttonProps },
  index,
  onRemove,
}: ProductVariantCardProps) => {
  const form = useFormContext<ProductSchema>();

  const uploadMediaDisclosure = useDisclosure();

  const image = useWatch({
    control: form.control,
    name: `variants.${index}.image`,
  });
  const isActive = useWatch({
    control: form.control,
    name: `variants.${index}.isActive`,
  });

  return (
    <div {...containerProps} className="overflow-hidden rounded-xl border bg-background transition-shadow">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <Button
            {...buttonProps}
            type="button"
            variant="ghost"
            size="sm"
            className="touch-none cursor-grab aria-pressed:cursor-grabbing"
            icon={<HugeiconsIcon icon={DragDropVerticalIcon} />}
          />

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Variant #{index + 1}</span>

            {!isActive && <span className="text-xs text-muted-foreground">Inactive</span>}
          </div>
        </div>

        <Button type="button" variant="ghost" size="sm" onClick={onRemove} icon={<HugeiconsIcon icon={X} />} />
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative size-20 shrink-0 self-center sm:self-start">
            <Button
              type="button"
              variant="outline"
              className="absolute inset-0 h-auto overflow-hidden p-0"
              aria-invalid={Boolean(form.formState.errors.variants?.[index]?.imageId)}
              onClick={uploadMediaDisclosure.onOpen}
              icon={!image ? <HugeiconsIcon icon={Plus} /> : undefined}
            >
              {image && <Media media={image} alt={`Variant ${index + 1}`} className="h-full w-full object-cover" />}
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

          <LocalizedForm<ProductSchema> name={`variants.${index}.name`} hideLabel className="flex-1 gap-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <VariantNumberInput index={index} name="stock" label="Stock" />

          <VariantNumberInput index={index} name="price" label="Price" />

          <VariantNumberInput index={index} name="costPerItem" label="Cost / Item" />

          <VariantNumberInput index={index} name="compareAt" label="Compare At" />
        </div>

        <Controller
          name={`variants.${index}.isActive`}
          control={form.control}
          render={({ field }) => (
            <FieldLabel htmlFor={`variants.${index}.isActive`}>
              <Field orientation="horizontal" className="flex items-center!">
                <FieldContent>
                  <FieldTitle className="text-sm md:text-base">Active</FieldTitle>
                </FieldContent>

                <Switch
                  id={`variants.${index}.isActive`}
                  defaultChecked
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              </Field>
            </FieldLabel>
          )}
        />
      </div>
    </div>
  );
};

interface VariantNumberInputProps {
  index: number;
  name: 'stock' | 'price' | 'costPerItem' | 'compareAt';
  label: string;
}

const VariantNumberInput = ({ index, name, label }: VariantNumberInputProps) => {
  const form = useFormContext<ProductSchema>();

  return (
    <Controller
      name={`variants.${index}.${name}` as const}
      control={form.control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>

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
