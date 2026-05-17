'use client';

import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Link } from '../Link';

export const ProductsCTA = () => {
  return (
    <div>
      <Link
        href="/products/add"
        className="flex items-center justify-center gap-1 h-7 px-2 bg-primary rounded-lg text-xs text-foreground"
      >
        <HugeiconsIcon icon={Plus} className="size-4" />
        Add Product
      </Link>
    </div>
  );
};
