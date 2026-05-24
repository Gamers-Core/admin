'use client';

import { useOrderQuery } from '@/hooks';

import { OrderStatusBadge } from './OrderStatusBadge';
import { Separator } from '../ui';
import { OrderStatusSelector } from './OrderStatusSelector';
import { OrderPaymentStatusSelector } from './OrderPaymentStatusSelector';
import { TopBarCTA } from '../sidebar';

interface OrderCTAProps {
  orderNumber: string;
}

export const OrderCTA = ({ orderNumber }: OrderCTAProps) => {
  const orderQuery = useOrderQuery(orderNumber);

  if (!orderQuery.data) return null;

  return (
    <TopBarCTA className="flex-1 gap-4 justify-between">
      <div className="flex items-center gap-4">
        <Separator orientation="vertical" className="h-auto" />

        <div className="flex gap-2">
          <OrderStatusBadge status={orderQuery.data.status} />

          <OrderStatusBadge status={orderQuery.data.paymentStatus} />
        </div>
      </div>

      <div className="flex gap-2">
        <OrderPaymentStatusSelector orderNumber={orderNumber} />

        <OrderStatusSelector orderNumber={orderNumber} />
      </div>
    </TopBarCTA>
  );
};
