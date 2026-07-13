import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import {
  DiscountForm,
  DiscountFormCTA,
  DiscountOptions,
  DiscountRestrictions,
  DiscountApplicability,
  DiscountEligibility,
  DiscountStatus,
} from '@/components';
import { useDiscountQuery } from '@/hooks';
import { PagePropsWithParams } from '@/app/types';

export const metadata: Metadata = { title: 'Gamers Core | Discounts | Edit Discount' };

export default async function EditDiscount(props: PagePropsWithParams<{ id: string }>) {
  const { id } = await props.params;
  const discountId = Number(id);
  if (!Number.isFinite(discountId)) return notFound();

  const queryClient = new QueryClient();

  const [discount] = await Promise.allSettled([
    queryClient.fetchQuery({
      queryKey: useDiscountQuery.queryKey(discountId),
      queryFn: useDiscountQuery.queryFn,
    }),
  ]);

  if (discount.status === 'rejected') return notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DiscountForm className="flex-1 flex flex-col md:flex-row gap-6" discount={discount.value}>
        <DiscountFormCTA discount={discount.value} />

        <div className="min-w-0 md:flex-2 lg:flex-3 xl:flex-4 flex flex-col gap-6">
          <DiscountOptions />

          <DiscountRestrictions />

          <DiscountApplicability />

          <DiscountEligibility />
        </div>

        <DiscountStatus />
      </DiscountForm>
    </HydrationBoundary>
  );
}
