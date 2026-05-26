'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, NoteIcon, PackageOpenIcon } from '@hugeicons/core-free-icons';

import { useOrderQuery } from '@/hooks';

interface OrderOptionsProps {
  orderNumber: string;
}

export const OrderOptions = ({ orderNumber }: OrderOptionsProps) => {
  const orderQuery = useOrderQuery(orderNumber);

  if (!orderQuery.data) return null;

  const { note, canOpenPackage } = orderQuery.data;

  if (!note && !canOpenPackage) return null;

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-sidebar/80 shadow-sm backdrop-blur-sm">
      <div className="border-b border-border p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Customer Preferences</p>

          <h2 className="text-xl font-semibold tracking-tight">Customer Options</h2>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 md:p-6">
        {canOpenPackage && (
          <div className="flex gap-4 rounded-2xl border border-border bg-background/70 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar">
              <HugeiconsIcon icon={PackageOpenIcon} className="size-5 text-green-500" />
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-semibold">Open Package Allowed</p>

              <p className="text-sm text-muted-foreground">Customer allowed opening and inspecting the package.</p>
            </div>

            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="ms-auto size-5 shrink-0 text-green-500" />
          </div>
        )}

        {note && (
          <div className="flex gap-4 rounded-2xl border border-border bg-background/70 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar">
              <HugeiconsIcon icon={NoteIcon} className="size-5 text-muted-foreground" />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">Customer Note</p>

              <p dir="rtl" className="whitespace-pre-wrap wrap-break-word font-cairo leading-relaxed text-foreground">
                {note}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
