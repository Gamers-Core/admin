'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  CreditCardIcon,
  Discount01Icon,
  MoneyReceiveCircleIcon,
  ReceiptDollarIcon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons';

import { useFormatCurrency, useOrderQuery } from '@/hooks';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderPaymentInfoProps {
  orderNumber: string;
}

const paymentMethodMap = {
  cod: Wallet01Icon,
  instapay: MoneyReceiveCircleIcon,
  valu: ReceiptDollarIcon,
  card: CreditCardIcon,
};

export const OrderPaymentInfo = ({ orderNumber }: OrderPaymentInfoProps) => {
  const orderQuery = useOrderQuery(orderNumber);

  const formatCurrency = useFormatCurrency();

  if (!orderQuery.data) return null;

  const paymentMethod = paymentMethodMap[orderQuery.data.paymentMethod];

  const hasDiscount = !!orderQuery.data.isFreeShipping || !!Number(orderQuery.data.discountAmount);

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-sidebar/80 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Payment Details</p>

          <h2 className="text-xl font-semibold tracking-tight">Billing Summary</h2>
        </div>

        <OrderStatusBadge status={orderQuery.data.paymentStatus} />
      </div>

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-sidebar">
              <HugeiconsIcon icon={paymentMethod} className="size-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>

              <p className="font-semibold uppercase">{orderQuery.data.paymentMethod}</p>
            </div>
          </div>
        </div>

        {hasDiscount && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-sidebar">
                <HugeiconsIcon icon={Discount01Icon} className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Discount</p>

                <p className="font-semibold uppercase">{orderQuery.data.discountCode ?? 'Automatic'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/70 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>

            <span className="font-medium">{formatCurrency(orderQuery.data.subtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping Fees</span>

            <span className="font-medium">
              {orderQuery.data.isFreeShipping ? 'Free Shipping' : formatCurrency(orderQuery.data.shippingFee)}
            </span>
          </div>

          {!!Number(orderQuery.data.codFee) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">COD</span>

              <span className="font-medium">{formatCurrency(Number(orderQuery.data.codFee))}</span>
            </div>
          )}

          {!!Number(orderQuery.data.openPackageFee) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Open Package Fee</span>

              <span className="font-medium">{formatCurrency(Number(orderQuery.data.openPackageFee))}</span>
            </div>
          )}

          {!!Number(orderQuery.data.discountAmount) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>

              <span className="font-medium">{formatCurrency(-Number(orderQuery.data.discountAmount))}</span>
            </div>
          )}

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Total</span>

            <span className="text-2xl font-bold text-sidebar-primary">{formatCurrency(orderQuery.data.total)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
