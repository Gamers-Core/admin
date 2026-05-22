'use client';

import { defaultLocale, VariantWithProduct } from '@/api';
import { useFormatCurrency } from '@/hooks';
import { cn } from '@/lib/utils';

import { Media } from '../Media';

interface ProductPreviewCardProps {
  variant: VariantWithProduct;
  className?: string;
}

export const ProductPreviewCard = ({ variant, className }: ProductPreviewCardProps) => {
  const formatCurrency = useFormatCurrency();

  return (
    <div className={cn('relative flex justify-between gap-2 p-4 border rounded-lg shadow-sm w-full', className)}>
      <div className="flex flex-1 items-center gap-2 md:gap-4">
        <div className="size-14 shrink-0 md:size-20">
          <Media
            media={variant.image}
            alt={`Variant ${variant.id} Image`}
            className="w-full aspect-square object-cover overflow-hidden rounded-lg"
          />
        </div>

        <div className="flex flex-col justify-center h-full gap-1">
          <h3 className="font-medium text-base line-clamp-1">{variant.product.name[defaultLocale]}</h3>

          <p className="text-sm text-muted-foreground line-clamp-1">{variant.name[defaultLocale]}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-1">
        <p className="text-sm text-foreground">{formatCurrency(variant.price)}</p>

        {variant.compareAt && (
          <p className="text-end text-xs text-muted-foreground line-through">{formatCurrency(variant.compareAt)}</p>
        )}
      </div>

      <p className="absolute top-1 inset-s-1 bg-sidebar-accent rounded-full p-2 text-sm text-muted-foreground min-w-6 min-h-6 aspect-square flex items-center justify-center">
        {variant.stock}
      </p>
    </div>
  );
};
