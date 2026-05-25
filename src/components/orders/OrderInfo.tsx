'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { DeliveryTracking01Icon, StoreVerified01Icon } from '@hugeicons/core-free-icons';

import { useFormatCurrency, useFormatDate, useOrderQuery } from '@/hooks';
import { defaultLocale } from '@/api';

import { OrderStatusBadge } from './OrderStatusBadge';
import { Link } from '../Link';
import { Image } from '../Image';

interface OrderInfoProps {
  orderNumber: string;
}

export const OrderInfo = ({ orderNumber }: OrderInfoProps) => {
  const orderQuery = useOrderQuery(orderNumber);

  const formatDate = useFormatDate();
  const formatCurrency = useFormatCurrency();

  if (!orderQuery.data) return null;

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-sidebar/80 backdrop-blur-sm shadow-sm">
      <div className="border-b border-border p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Order #{orderQuery.data.orderNumber}</p>

            <h2 className="text-xl font-semibold tracking-tight">Order Details</h2>
          </div>

          <OrderStatusBadge status={orderQuery.data.status} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HugeiconsIcon icon={StoreVerified01Icon} className="size-4 shrink-0" />

            <span>{formatDate(orderQuery.data.createdAt, "MMM d, yyyy 'at' h:mma")}</span>
          </div>

          {orderQuery.data.trackingNumber && (
            <div className="flex items-center gap-2 text-sm">
              <HugeiconsIcon icon={DeliveryTracking01Icon} className="size-4 shrink-0 text-muted-foreground" />

              <span className="text-muted-foreground">Tracking Number:</span>

              <Link
                href={`https://bosta.co/en-eg/tracking-shipments?shipment-number=${orderQuery.data.trackingNumber}`}
                className="font-medium text-sidebar-primary hover:underline"
              >
                {orderQuery.data.trackingNumber}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-4">
          {orderQuery.data.items.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-border bg-background/70 p-4 transition-all duration-300 hover:border-sidebar-primary/30 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4 min-w-0">
                  <div className="shrink-0 overflow-hidden rounded-xl border border-border bg-sidebar p-1">
                    <Image
                      src={item.imageURL}
                      width={80}
                      height={80}
                      alt={item.productTitle[defaultLocale] + ' - ' + item.variantName?.[defaultLocale]}
                      className="h-20 w-20 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1 py-1">
                    <Link
                      href={`/products/${item.productId}`}
                      target="_blank"
                      className="line-clamp-2 text-base font-semibold text-foreground hover:underline"
                      title={item.productTitle[defaultLocale]}
                    >
                      {item.productTitle[defaultLocale]}
                    </Link>

                    {item.variantName && (
                      <p className="mt-1 text-sm text-muted-foreground">{item.variantName[defaultLocale]}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground font-medium">{formatCurrency(item.unitPrice)}</span>

                    <span className="text-muted-foreground">x</span>

                    <span className="min-w-7 rounded-full bg-sidebar px-2 py-1 text-center text-xs font-semibold text-foreground">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-sidebar-primary">{formatCurrency(item.lineTotal)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
