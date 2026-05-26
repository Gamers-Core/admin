'use client';

import { HugeiconsIcon } from '@hugeicons/react';

import { getOrderStatuses, statusesStyleMap } from '@/api';

import { useFormatDate, useOrderQuery } from '@/hooks';
import { cn } from '@/lib/utils';

import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderTimelineProps {
  orderNumber: string;
}

export const OrderStatusTimeline = ({ orderNumber }: OrderTimelineProps) => {
  const orderQuery = useOrderQuery(orderNumber);

  const formatDate = useFormatDate();

  if (!orderQuery.data) return null;

  const statuses = getOrderStatuses(orderQuery.data).reverse();

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-sidebar/80 shadow-sm backdrop-blur-sm">
      <div className="border-b border-border p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Order Activity</p>

          <h2 className="text-xl font-semibold tracking-tight">Timeline</h2>
        </div>
      </div>

      <div className="flex flex-col p-4 md:p-6">
        {statuses.map((item, index) => {
          const isLast = index === statuses.length - 1;

          return (
            <div key={`${item.status}-${item.date.toISOString()}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background',
                    statusesStyleMap[item.style],
                  )}
                >
                  <HugeiconsIcon icon={item.icon} className="size-5" />
                </div>

                {!isLast && <div className="my-2 w-px flex-1 bg-border" />}
              </div>

              <div className="flex flex-1 flex-col gap-2 pb-6 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold capitalize">{item.status.replace('-', ' ')}</p>

                  <p className="text-sm text-muted-foreground">{formatDate(item.date, "MMM d, yyyy 'at' h:mma")}</p>
                </div>

                <div>
                  <OrderStatusBadge status={item.status} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
