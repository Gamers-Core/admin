'use client';

import { verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Controller, useFormContext } from 'react-hook-form';

import { ProductSchema, VariantSchema, defaultLocalizedValue } from '@/api';
import { Button, Field, FieldError, ReorderList } from '@/components';

import { ProductVariantCard } from './ProductVariantCard';

const defaultVariantValues: VariantSchema = {
  name: defaultLocalizedValue,
  price: 0,
  imageId: null as unknown as number,
  costPerItem: 0,
  position: 0,
  stock: 0,
  compareAt: 0,
  isActive: true,
};

export const ProductVariants = () => {
  const form = useFormContext<ProductSchema>();

  return (
    <ReorderList
      items={form.watch('variants')}
      onReorder={(items) => form.setValue('variants', items, { shouldDirty: true, shouldValidate: true })}
      strategy={verticalListSortingStrategy}
      renderContainer={(children) => <div className="flex flex-col gap-4">{children}</div>}
      renderItem={(item, sortable, index, state) => (
        <ProductVariantCard
          key={state.getItemId(item)}
          sortable={sortable}
          index={index}
          onRemove={() => state.setItems(state.items.filter((_, i) => i !== index))}
        />
      )}
    >
      {(content, state) => (
        <section className="flex min-h-48 flex-col gap-6 rounded-lg bg-sidebar p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">Variants</h3>

            <Button
              variant="outline"
              size="sm"
              icon={<HugeiconsIcon icon={Plus} />}
              onClick={() =>
                state.setItems([...state.items, { ...defaultVariantValues, position: state.items.length }])
              }
            >
              Add Variant
            </Button>
          </div>

          {state.items.length === 0 && <p className="m-auto text-sm text-muted-foreground">No variants added yet.</p>}

          <Controller
            name="variants"
            control={form.control}
            render={({ fieldState }) => (
              <Field>
                {content}

                {Array.isArray(fieldState.error) && (
                  <FieldError className="text-sm/normal lg:text-sm/relaxed">
                    There&apos;s an error with the variants.
                  </FieldError>
                )}

                {fieldState.error && (
                  <FieldError className="text-sm/normal lg:text-sm/relaxed" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </section>
      )}
    </ReorderList>
  );
};
