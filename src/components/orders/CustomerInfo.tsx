'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Call02Icon, Mail01Icon, MapsLocation01Icon, UserIcon } from '@hugeicons/core-free-icons';

import { useOrderQuery } from '@/hooks';

interface CustomerInfoProps {
  orderNumber: string;
}

export const CustomerInfo = ({ orderNumber }: CustomerInfoProps) => {
  const orderQuery = useOrderQuery(orderNumber);

  if (!orderQuery.data) return null;

  const { user, shippingAddress } = orderQuery.data;

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-sidebar/80 shadow-sm backdrop-blur-sm">
      <div className="border-b border-border p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Customer Details</p>

          <h2 className="text-xl font-semibold tracking-tight">Customer Info</h2>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex gap-4 rounded-2xl border border-border bg-background/70 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar">
            <HugeiconsIcon icon={UserIcon} className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Customer Name</p>

            <p className="truncate font-semibold text-foreground">{user.name}</p>
          </div>
        </div>

        <div className="flex gap-4 rounded-2xl border border-border bg-background/70 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar">
            <HugeiconsIcon icon={Mail01Icon} className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Email Address</p>

            <p className="truncate font-semibold text-foreground">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-4 rounded-2xl border border-border bg-background/70 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar">
            <HugeiconsIcon icon={Call02Icon} className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Phone Number</p>

            <p dir="ltr" className="font-semibold text-foreground">
              {shippingAddress.phoneNumber}
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-2xl border border-border bg-background/70 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar">
            <HugeiconsIcon icon={MapsLocation01Icon} className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Shipping Address</p>

            <div dir="rtl" className="flex flex-col gap-1 font-cairo">
              <p className="font-semibold text-foreground">{shippingAddress.nameAr}</p>

              <p className="text-sm text-muted-foreground">
                {shippingAddress.cityName} • {shippingAddress.districtName}
              </p>

              <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-foreground">
                {shippingAddress.detailedAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
