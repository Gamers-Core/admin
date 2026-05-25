'use client';

import { useState } from 'react';

import { useDisclosure, useIsMobile, useOrderQuery, useUpdateOrderStatusMutation } from '@/hooks';
import { OrderStatus } from '@/api';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui';
import { OrderStatusBadge } from './OrderStatusBadge';
import { UpdateStatusAlert } from './UpdateStatusAlert';
import { HugeiconsIcon } from '@hugeicons/react';
import { DeliveryBox01FreeIcons } from '@hugeicons/core-free-icons';

interface OrderPaymentStatusSelectorProps {
  orderNumber: string;
}

export const OrderStatusSelector = ({ orderNumber }: OrderPaymentStatusSelectorProps) => {
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  const orderQuery = useOrderQuery(orderNumber);
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();

  const disclosure = useDisclosure({ canClose: !updateOrderStatusMutation.isPending });
  const isMobile = useIsMobile();

  const onSelect = (newStatus: OrderStatus) => {
    if (newStatus === orderQuery.data?.status) return;

    setPendingStatus(newStatus);
    disclosure.onOpen();
  };

  const onConfirm = () => {
    if (!pendingStatus) return;

    updateOrderStatusMutation.mutate({ orderNumber, status: pendingStatus }, { onSettled: onClose });
  };

  const onClose = () => {
    disclosure.onClose();

    setPendingStatus(null);
  };

  if (!orderQuery.data) return null;

  return (
    <>
      <Select value={orderQuery.data.status} onValueChange={onSelect}>
        <SelectTrigger
          disabled={!orderQuery.data.allowedActions?.statuses.length}
          className="min-w-auto h-8! max-h-max text-sm capitalize p-0.5 gap-1"
        >
          {isMobile ? <HugeiconsIcon icon={DeliveryBox01FreeIcons} className="size-4" /> : <SelectValue />}
        </SelectTrigger>

        <SelectContent position="popper">
          <SelectGroup>
            <SelectItem disabled value={orderQuery.data.status} className="capitalize text-sm">
              <OrderStatusBadge status={orderQuery.data.status} />
            </SelectItem>

            {orderQuery.data.allowedActions?.statuses.map((status) => (
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
          current={orderQuery.data.status}
          next={pendingStatus}
          onSubmit={onConfirm}
          onCancel={onClose}
          isPending={updateOrderStatusMutation.isPending}
        />
      )}
    </>
  );
};
