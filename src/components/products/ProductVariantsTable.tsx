'use client';

import { closestCenter, DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Controller, useFormContext } from 'react-hook-form';

import { ProductSchema, VariantSchema, defaultLocalizedValue } from '@/api';
import { Button, Field, FieldError } from '@/components';
import { useReorder } from '@/hooks';

import { ProductVariantRow } from './ProductVariantRow';

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

export const ProductVariantsTable = () => {
  const form = useFormContext<ProductSchema>();

  const { dndId, sensors, onDragEnd, state } = useReorder({
    items: form.watch('variants'),
    onReorder: (items) => form.setValue('variants', items, { shouldDirty: true }),
  });

  return (
    <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-6 min-h-48">
      <div className="flex justify-between gap-2">
        <h3 className="text-lg font-semibold">Variants</h3>

        <Button
          variant="outline"
          size="sm"
          icon={<HugeiconsIcon icon={Plus} />}
          onClick={() =>
            state.items && state.setItems([...state.items, { ...defaultVariantValues, position: state.items?.length }])
          }
        >
          Add Variant
        </Button>
      </div>

      {state.items.length < 1 && <p className="text-sm text-muted-foreground m-auto">No variants added yet.</p>}

      <Controller
        name="variants"
        control={form.control}
        render={({ fieldState }) => (
          <Field>
            {state.items.length > 0 && (
              <div className="overflow-x-auto rounded-lg border bg-background">
                <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext items={state.items.map((_, index) => index)} strategy={verticalListSortingStrategy}>
                    <table className="w-full min-w-300 text-sm">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="w-12 p-2" />
                          <th className="w-24 p-2 text-left font-medium">
                            Image <span className="text-destructive">*</span>
                          </th>
                          <th className="min-w-65 p-2 text-left font-medium">
                            Label <span className="text-destructive">*</span>
                          </th>
                          <th className="w-28 p-2 text-left font-medium">
                            Stock <span className="text-destructive">*</span>
                          </th>
                          <th className="w-24 p-2 text-center font-medium">Active</th>
                          <th className="w-32 p-2 text-left font-medium">
                            Price <span className="text-destructive">*</span>
                          </th>
                          <th className="w-32 p-2 text-left font-medium">
                            Cost / Item <span className="text-destructive">*</span>
                          </th>
                          <th className="w-32 p-2 text-left font-medium">
                            Compare At <span className="text-destructive">*</span>
                          </th>
                          <th className="w-14 p-2" />
                        </tr>
                      </thead>

                      <tbody>
                        {state.items.map((item, index) => (
                          <ProductVariantRow
                            key={item.id}
                            index={index}
                            onRemove={() => state.setItems(state.items.filter((_, i) => i !== index))}
                          />
                        ))}
                      </tbody>
                    </table>
                  </SortableContext>
                </DndContext>
              </div>
            )}

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
  );
};
