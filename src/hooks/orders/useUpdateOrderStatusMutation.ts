'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, Order, OrderStatus, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetOrderQueryData } from './useOrderQuery';

interface UpdateOrderStatusData {
  status: OrderStatus;
}

interface UpdateOrderStatusMutationOptions extends UpdateOrderStatusData {
  orderNumber: string;
}

export const useUpdateOrderStatusMutation = () => {
  const errorHandler = useErrorHandler();

  const setOrderQueryData = useSetOrderQueryData();

  return useMutation<Order, BackendError | null, UpdateOrderStatusMutationOptions>({
    mutationFn: ({ orderNumber, status }) =>
      gamersCoreAdmin
        .patch<Order, AxiosResponse<Order>, UpdateOrderStatusData>(`/orders/${orderNumber}/status`, { status })
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setOrderQueryData(data.orderNumber, data);
    },
  });
};
