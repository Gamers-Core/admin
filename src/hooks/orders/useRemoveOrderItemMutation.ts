'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, Order, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetOrderQueryData } from './useOrderQuery';
import { useInvalidateOrdersQuery } from './useOrdersQuery';
import { useInvalidateProductsQuery } from '../products';

interface RemoveOrderItemMutationOptions {
  orderNumber: string;
  itemId: number;
}

export const useRemoveOrderItemMutation = () => {
  const errorHandler = useErrorHandler();

  const setOrderQueryData = useSetOrderQueryData();
  const invalidateOrdersQuery = useInvalidateOrdersQuery();
  const invalidateProductsQuery = useInvalidateProductsQuery();

  return useMutation<Order, BackendError | null, RemoveOrderItemMutationOptions>({
    mutationFn: ({ orderNumber, itemId }) =>
      gamersCoreAdmin
        .delete<Order, AxiosResponse<Order>>(`/orders/${orderNumber}/items/${itemId}`)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setOrderQueryData(data.orderNumber, data);

      invalidateOrdersQuery();
      invalidateProductsQuery();
    },
  });
};
