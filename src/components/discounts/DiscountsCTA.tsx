'use client';

import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Link } from '../Link';
import { TopBarCTA } from '../sidebar';

export const DiscountsCTA = () => (
  <TopBarCTA>
    <Link
      href="/discounts/add"
      className="flex items-center justify-center gap-1 h-7 px-2 bg-primary rounded-lg text-xs text-foreground"
    >
      <HugeiconsIcon icon={Plus} className="size-4" />
      Add Discount
    </Link>
  </TopBarCTA>
);
