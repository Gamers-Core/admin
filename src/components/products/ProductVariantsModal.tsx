'use client';

import { useEffect, useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check } from '@hugeicons/core-free-icons';

import { defaultLocale, Product, VariantWithProduct } from '@/api';
import { Disclosure, useDebounce, useFormatCurrency, useProductsQuery } from '@/hooks';
import { cn } from '@/lib/utils';

import { Modal, ModalFooter } from '../Modal';
import { Input, Spinner } from '../ui';
import { Button } from '../Button';
import { Media } from '../Media';

interface ProductVariantsModalProps<M extends 'single' | 'multiple'> extends Disclosure {
  mode: M;
  onVariantSelect?: (variantId: [VariantWithProduct] | VariantWithProduct[]) => void;
  variantIds?: number[];
}

export const ProductVariantsModal = <M extends 'single' | 'multiple'>({
  mode,
  onVariantSelect,
  variantIds,
  ...disclosure
}: ProductVariantsModalProps<M>) => {
  const isSingleMode = mode === 'single';

  const [search, setSearch] = useState<string>();

  const debouncedSearch = useDebounce(search, 700);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch]);

  const productsQuery = useProductsQuery({ q: debouncedSearch });

  const selectedVariantsById = useMemo(
    () =>
      productsQuery.data
        ?.flatMap((product) => product.variants.map((variant) => ({ ...variant, product })))
        .filter((variant) => variantIds?.includes(variant.id)),
    [productsQuery.data, variantIds],
  );

  const [selectedVariants, setSelectedVariants] = useState<VariantWithProduct[]>(selectedVariantsById ?? []);

  useEffect(() => {
    if (!productsQuery.data || !variantIds) return;

    setSelectedVariants(selectedVariantsById ?? []);
  }, [variantIds, productsQuery.data, selectedVariantsById]);

  return (
    <Modal title="Select Variants" {...disclosure}>
      <Input
        value={search ?? ''}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for products, variants, etc."
        className="w-full min-h-10 p-2 px-3 text-sm/relaxed md:text-base/relaxed bg-accent"
      />

      <div className="flex flex-col gap-4 overflow-y-auto">
        {productsQuery.isPending ? (
          <Spinner className="size-8 m-auto" />
        ) : (
          productsQuery.data?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selectedVariants={selectedVariants}
              onSelect={(variant) =>
                setSelectedVariants(
                  isSingleMode
                    ? [variant]
                    : (prev) => (prev.includes(variant) ? prev.filter((v) => v !== variant) : [...prev, variant]),
                )
              }
            />
          ))
        )}
      </div>

      <ModalFooter>
        <Button
          variant="default"
          className="w-full h-auto py-2 text-lg"
          isDisabled={selectedVariants.length === 0 || (isSingleMode && selectedVariants.length > 1)}
          isLoading={productsQuery.isPending}
          onClick={() => {
            onVariantSelect?.(mode === 'single' ? ([selectedVariants[0]] as [VariantWithProduct]) : selectedVariants);

            disclosure.onClose();
          }}
        >
          {variantIds && variantIds.length > 0 ? 'Update' : 'Add'} Variant{mode === 'multiple' && 's'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

interface ProductCardProps {
  product: Product;
  onSelect: (variant: VariantWithProduct) => void;
  selectedVariants?: VariantWithProduct[];
}

const ProductCard = ({ product, onSelect, selectedVariants }: ProductCardProps) => {
  const formatCurrency = useFormatCurrency();

  return (
    <div className="flex flex-col gap-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center gap-4 p-4 pb-0">
        <h3 className="font-medium text-sm">{product.name[defaultLocale]}</h3>

        <p className="text-sm text-muted-foreground">
          {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex flex-col gap-2 p-2 pt-0 md:p-4 md:pt-0">
        {product.variants.map((variant) => {
          const isSelected = selectedVariants?.some((selected) => selected.id === variant.id);

          return (
            <Button
              key={variant.id}
              isDisabled={!variant.isActive}
              variant="outline"
              className="relative p-4 border-b justify-between text-start last:border-0 h-auto hover:opacity-80 transition-opacity duration-300"
              onClick={() => onSelect({ ...variant, product })}
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="size-16">
                  <Media
                    media={variant.image}
                    alt={`Variant ${variant.id} Image`}
                    className="w-full aspect-square object-cover overflow-hidden rounded-lg"
                  />
                </div>

                <div className="flex flex-col justify-between gap-1">
                  <p className="text-sm">{variant.name[defaultLocale]}</p>

                  <p
                    className={cn('text-sm', {
                      'text-green-500': variant.stock > 0,
                      'text-red-500': variant.stock === 0,
                    })}
                  >
                    {variant.stock} in stock
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex flex-col justify-between gap-1">
                  <p className="text-sm text-foreground">{formatCurrency(variant.price)}</p>

                  {variant.compareAt && (
                    <p className="text-sm text-muted-foreground line-through">{formatCurrency(variant.compareAt)}</p>
                  )}
                </div>

                <div
                  className={cn(
                    'size-6 flex justify-center items-center rounded-full border bg-transparent transition-colors duration-300',
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
              </div>

              {!variant.isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm font-medium rounded-lg">
                  Inactive
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
