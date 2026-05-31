'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { AddOrderItemSchema, BackendError, Order, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetOrderQueryData } from './useOrderQuery';
import { useInvalidateOrdersQuery } from './useOrdersQuery';
import { useInvalidateProductsQuery } from '../products';

interface AddOrderItemMutationOptions extends AddOrderItemSchema {
  orderNumber: string;
}

export const useAddOrderItemMutation = () => {
  const errorHandler = useErrorHandler();

  const setOrderQueryData = useSetOrderQueryData();
  const invalidateOrdersQuery = useInvalidateOrdersQuery();
  const invalidateProductsQuery = useInvalidateProductsQuery();

  return useMutation<
    Order,
    BackendError<ValidationErrors<keyof AddOrderItemSchema>> | null,
    AddOrderItemMutationOptions
  >({
    mutationFn: ({ orderNumber, ...data }) =>
      gamersCoreAdmin
        .post<Order, AxiosResponse<Order>, AddOrderItemSchema>(`/orders/${orderNumber}/items`, data)
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
