'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, Order, UpdateOrderItemSchema, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetOrderQueryData } from './useOrderQuery';
import { useInvalidateOrdersQuery } from './useOrdersQuery';
import { useInvalidateProductsQuery } from '../products';

interface UpdateOrderItemMutationOptions extends UpdateOrderItemSchema {
  orderNumber: string;
  itemId: number;
}

export const useUpdateOrderItemMutation = () => {
  const errorHandler = useErrorHandler();

  const setOrderQueryData = useSetOrderQueryData();
  const invalidateOrdersQuery = useInvalidateOrdersQuery();
  const invalidateProductsQuery = useInvalidateProductsQuery();

  return useMutation<
    Order,
    BackendError<ValidationErrors<keyof UpdateOrderItemSchema>> | null,
    UpdateOrderItemMutationOptions
  >({
    mutationFn: ({ orderNumber, itemId, ...data }) =>
      gamersCoreAdmin
        .patch<Order, AxiosResponse<Order>, UpdateOrderItemSchema>(`/orders/${orderNumber}/items/${itemId}`, data)
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
