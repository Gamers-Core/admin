'use client';

import { useEffect, useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check } from '@hugeicons/core-free-icons';

import { Category, defaultLocale } from '@/api';
import { Disclosure, useCategoriesQuery } from '@/hooks';
import { cn } from '@/lib/utils';

import { Modal, ModalFooter } from '../Modal';
import { Input, Spinner } from '../ui';
import { Button } from '../Button';

interface CategorySelectModalProps<M extends 'single' | 'multiple'> extends Disclosure {
  mode: M;
  onCategoriesSelect?: (categories: [Category] | Category[]) => void;
  categoryIds?: number[];
}

export const CategorySelectModal = <M extends 'single' | 'multiple'>({
  mode,
  onCategoriesSelect,
  categoryIds,
  ...disclosure
}: CategorySelectModalProps<M>) => {
  const isSingleMode = mode === 'single';

  const [search, setSearch] = useState<string>('');

  const categoriesQuery = useCategoriesQuery();

  const filteredCategories = useMemo(() => {
    if (!categoriesQuery.data) return categoriesQuery.data;

    const trimmedQ = search.trim().toLowerCase();
    if (!trimmedQ) return categoriesQuery.data;

    return categoriesQuery.data.filter((category) => category.name[defaultLocale].toLowerCase().includes(trimmedQ));
  }, [categoriesQuery.data, search]);

  const selectedCategoriesById = useMemo(
    () => categoriesQuery.data?.filter((category) => categoryIds?.includes(category.id)),
    [categoriesQuery.data, categoryIds],
  );

  const [selectedCategories, setSelectedCategories] = useState<Category[]>(selectedCategoriesById ?? []);

  useEffect(() => {
    if (!categoriesQuery.data || !categoryIds) return;

    setSelectedCategories(selectedCategoriesById ?? []);
  }, [categoryIds, categoriesQuery.data, selectedCategoriesById]);

  return (
    <Modal title="Select Categories" {...disclosure}>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for categories..."
        className="w-full min-h-10 p-2 px-3 text-sm/relaxed md:text-base/relaxed bg-accent"
      />

      <div className="flex flex-col gap-4 overflow-y-auto">
        {categoriesQuery.isPending ? (
          <Spinner className="size-8 m-auto" />
        ) : (
          filteredCategories?.map((category) => {
            const isSelected = selectedCategories.some(({ id }) => id === category.id);

            return (
              <Button
                key={category.id}
                variant="outline"
                className="flex gap-4 border rounded-lg shadow-sm relative p-4 justify-between text-start h-auto hover:opacity-80 transition-opacity duration-300"
                onClick={() =>
                  setSelectedCategories(
                    isSingleMode
                      ? [category]
                      : isSelected
                        ? selectedCategories.filter(({ id }) => id !== category.id)
                        : [...selectedCategories, category],
                  )
                }
              >
                <h3 className="font-medium text-sm truncate min-w-0 flex-1">{category.name[defaultLocale]}</h3>

                <div
                  className={cn(
                    'size-6 shrink-0 flex justify-center items-center rounded-full border bg-transparent transition-colors duration-300',
                    { 'border-primary bg-primary': isSelected },
                  )}
                >
                  <HugeiconsIcon
                    icon={Check}
                    className={cn('text-muted-foreground transition-colors duration-300 invisible', {
                      'text-foreground visible': isSelected,
                    })}
                  />
                </div>
              </Button>
            );
          })
        )}
      </div>

      <ModalFooter>
        <Button
          variant="default"
          className="w-full h-auto py-2 text-lg"
          isDisabled={selectedCategories.length === 0 || (isSingleMode && selectedCategories.length > 1)}
          isLoading={categoriesQuery.isPending}
          onClick={() => {
            onCategoriesSelect?.(mode === 'single' ? [selectedCategories[0]] : selectedCategories);

            disclosure.onClose();
          }}
        >
          {categoryIds && categoryIds.length > 0 ? 'Update' : 'Add'} Categor{mode === 'multiple' ? 'ies' : 'y'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
