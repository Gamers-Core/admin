'use client';

import { useState } from 'react';

import { useDisclosure, useOrderQuery, useUpdateOrderPaymentStatusMutation } from '@/hooks';
import { PaymentStatus } from '@/api';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui';
import { OrderStatusBadge } from './OrderStatusBadge';
import { UpdateStatusAlert } from './UpdateStatusAlert';

interface OrderPaymentStatusSelectorProps {
  orderNumber: string;
}

export const OrderPaymentStatusSelector = ({ orderNumber }: OrderPaymentStatusSelectorProps) => {
  const [pendingStatus, setPendingStatus] = useState<PaymentStatus | null>(null);

  const orderQuery = useOrderQuery(orderNumber);
  const updateOrderPaymentStatusMutation = useUpdateOrderPaymentStatusMutation();

  const disclosure = useDisclosure({ canClose: !updateOrderPaymentStatusMutation.isPending });

  const onSelect = (newStatus: PaymentStatus) => {
    if (newStatus === orderQuery.data?.paymentStatus) return;

    setPendingStatus(newStatus);
    disclosure.onOpen();
  };

  const onConfirm = () => {
    if (!pendingStatus) return;

    updateOrderPaymentStatusMutation.mutate({ orderNumber, paymentStatus: pendingStatus }, { onSettled: onClose });
  };

  const onClose = () => {
    disclosure.onClose();

    setPendingStatus(null);
  };

  if (!orderQuery.data) return null;

  return (
    <>
      <Select value={orderQuery.data.paymentStatus} onValueChange={onSelect}>
        <SelectTrigger
          disabled={!orderQuery.data.allowedActions?.paymentStatuses.length}
          className="min-w-24 h-10! max-h-max text-sm capitalize"
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent position="popper">
          <SelectGroup>
            <SelectItem disabled value={orderQuery.data.paymentStatus} className="capitalize text-sm">
              <OrderStatusBadge status={orderQuery.data.paymentStatus} />
            </SelectItem>

            {orderQuery.data.allowedActions?.paymentStatuses.map((status) => (
              <SelectItem key={status} value={status} className="capitalize text-sm">
                <OrderStatusBadge status={status} />
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {pendingStatus && (
        <UpdateStatusAlert
          open={disclosure.open}
          onOpenChange={disclosure.onOpenChange}
          current={orderQuery.data.paymentStatus}
          next={pendingStatus}
          onSubmit={onConfirm}
          onCancel={onClose}
          isPending={updateOrderPaymentStatusMutation.isPending}
        />
      )}
    </>
  );
};
