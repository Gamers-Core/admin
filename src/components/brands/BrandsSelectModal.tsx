'use client';

import { useEffect, useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check } from '@hugeicons/core-free-icons';

import { Brand, defaultLocale } from '@/api';
import { Disclosure, useBrandsQuery } from '@/hooks';
import { cn } from '@/lib/utils';

import { Modal, ModalFooter } from '../Modal';
import { Input, Spinner } from '../ui';
import { Button } from '../Button';
import { Media } from '../Media';

interface BrandSelectModalProps<M extends 'single' | 'multiple'> extends Disclosure {
  mode: M;
  onBrandsSelect?: (brands: [Brand] | Brand[]) => void;
  brandIds?: number[];
}

export const BrandSelectModal = <M extends 'single' | 'multiple'>({
  mode,
  onBrandsSelect,
  brandIds,
  ...disclosure
}: BrandSelectModalProps<M>) => {
  const isSingleMode = mode === 'single';

  const [search, setSearch] = useState<string>('');

  const brandsQuery = useBrandsQuery();

  const filteredBrands = useMemo(() => {
    if (!brandsQuery.data) return brandsQuery.data;

    const trimmedQ = search.trim().toLowerCase();
    if (!trimmedQ) return brandsQuery.data;

    return brandsQuery.data.filter((brand) => brand.name[defaultLocale].toLowerCase().includes(trimmedQ));
  }, [brandsQuery.data, search]);

  const selectedBrandsById = useMemo(
    () => brandsQuery.data?.filter((brand) => brandIds?.includes(brand.id)),
    [brandsQuery.data, brandIds],
  );

  const [selectedBrands, setSelectedBrands] = useState<Brand[]>(selectedBrandsById ?? []);

  useEffect(() => {
    if (!brandsQuery.data || !brandIds) return;

    setSelectedBrands(selectedBrandsById ?? []);
  }, [brandIds, brandsQuery.data, selectedBrandsById]);

  return (
    <Modal title="Select Brands" {...disclosure}>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for brands..."
        className="w-full min-h-10 p-2 px-3 text-sm/relaxed md:text-base/relaxed bg-accent"
      />

      <div className="flex flex-col gap-4 overflow-y-auto">
        {brandsQuery.isPending ? (
          <Spinner className="size-8 m-auto" />
        ) : (
          filteredBrands?.map((brand) => {
            const isSelected = selectedBrands.some(({ id }) => id === brand.id);

            return (
              <Button
                key={brand.id}
                variant="outline"
                className="flex gap-4 border rounded-lg shadow-sm relative p-4 justify-between text-start h-auto hover:opacity-80 transition-opacity duration-300"
                onClick={() =>
                  setSelectedBrands(
                    isSingleMode
                      ? [brand]
                      : isSelected
                        ? selectedBrands.filter(({ id }) => id !== brand.id)
                        : [...selectedBrands, brand],
                  )
                }
              >
                <div className="flex flex-1 items-center gap-4 min-w-0">
                  <div className="size-12 shrink-0">
                    <Media
                      media={brand.image}
                      alt={brand.name[defaultLocale]}
                      className="w-full aspect-square object-cover overflow-hidden rounded-full"
                    />
                  </div>

                  <h3 className="font-medium text-sm truncate min-w-0">{brand.name[defaultLocale]}</h3>
                </div>

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
          isDisabled={selectedBrands.length === 0 || (isSingleMode && selectedBrands.length > 1)}
          isLoading={brandsQuery.isPending}
          onClick={() => {
            onBrandsSelect?.(mode === 'single' ? [selectedBrands[0]] : selectedBrands);

            disclosure.onClose();
          }}
        >
          {brandIds && brandIds.length > 0 ? 'Update' : 'Add'} Brand{mode === 'multiple' && 's'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
