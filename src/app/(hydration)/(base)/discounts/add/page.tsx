import { Metadata } from 'next';

import {
  DiscountForm,
  DiscountFormCTA,
  DiscountOptions,
  DiscountStatus,
  DiscountRestrictions,
  DiscountApplicability,
  DiscountEligibility,
} from '@/components';

export const metadata: Metadata = { title: 'Gamers Core | Discounts | Add Discount' };

export default async function AddDiscount() {
  return (
    <DiscountForm className="flex-1 flex flex-col md:flex-row gap-6">
      <DiscountFormCTA />

      <div className="min-w-0 md:flex-2 lg:flex-3 xl:flex-4 flex flex-col gap-6">
        <DiscountOptions />

        <DiscountRestrictions />

        <DiscountApplicability />

        <DiscountEligibility />
      </div>

      <DiscountStatus />
    </DiscountForm>
  );
}
