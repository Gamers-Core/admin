'use client';

import { closestCenter, DragEndEvent, DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { AddProductSchema, AddVariantSchema, defaultLocalizedValue } from '@/api';
import { Button, Field, FieldError } from '@/components';
import { useReorder } from '@/hooks';
import { useProductVariantsReorderStore } from '@/stores';

import { AddProductVariantRow } from './AddProductVariantRow';

const defaultVariantValues: AddVariantSchema = {
  name: defaultLocalizedValue,
  price: 0,
  imageId: null as unknown as number,
  costPerItem: 0,
  position: 0,
  stock: 0,
  compareAt: 0,
  isActive: true,
};

export const AddProductVariants = () => {
  const form = useFormContext<AddProductSchema>();
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: 'variants' });

  const { dndId, sensors } = useReorder(useProductVariantsReorderStore);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((_, i) => i === active.id);
    const newIndex = fields.findIndex((_, i) => i === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    move(oldIndex, newIndex);
  };

  return (
    <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-6 min-h-48">
      <div className="flex justify-between gap-2">
        <h3 className="text-lg font-semibold">Variants</h3>

        <Button
          variant="outline"
          size="sm"
          icon={<HugeiconsIcon icon={Plus} />}
          onClick={() => append({ ...defaultVariantValues, position: fields.length })}
        >
          Add Variant
        </Button>
      </div>

      {fields.length > 0 ? (
        <Controller
          name="variants"
          control={form.control}
          render={({ fieldState }) => (
            <Field>
              <div className="overflow-x-auto rounded-lg border bg-background">
                <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext items={fields.map((_, index) => index)} strategy={verticalListSortingStrategy}>
                    <table className="w-full min-w-300 text-sm">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="w-12 p-2" />
                          <th className="w-24 p-2 text-left font-medium">Image</th>
                          <th className="min-w-65 p-2 text-left font-medium">Label</th>
                          <th className="w-28 p-2 text-left font-medium">Stock</th>
                          <th className="w-24 p-2 text-center font-medium">Active</th>
                          <th className="w-32 p-2 text-left font-medium">Price</th>
                          <th className="w-32 p-2 text-left font-medium">Cost / Item</th>
                          <th className="w-32 p-2 text-left font-medium">Compare At</th>
                          <th className="w-14 p-2" />
                        </tr>
                      </thead>

                      <tbody>
                        {fields.map((field, index) => (
                          <AddProductVariantRow key={field.id} index={index} onRemove={() => remove(index)} />
                        ))}
                      </tbody>
                    </table>
                  </SortableContext>
                </DndContext>
              </div>

              {fieldState.invalid && (
                <FieldError className="text-sm/normal lg:text-sm/relaxed" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      ) : (
        <p className="text-sm text-muted-foreground m-auto">No variants added yet.</p>
      )}
    </section>
  );
};
