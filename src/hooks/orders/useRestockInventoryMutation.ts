'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, Order, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetOrderQueryData } from './useOrderQuery';
import { useInvalidateOrdersQuery } from './useOrdersQuery';
import { useInvalidateProductsQuery } from '../products';

export const useRestockInventoryMutation = () => {
  const errorHandler = useErrorHandler();

  const setOrderQueryData = useSetOrderQueryData();
  const invalidateOrdersQuery = useInvalidateOrdersQuery();
  const invalidateProductsQuery = useInvalidateProductsQuery();

  return useMutation<Order, BackendError | null, string>({
    mutationFn: (orderNumber) =>
      gamersCoreAdmin
        .post<Order, AxiosResponse<Order>>(`/orders/${orderNumber}/restock`)
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
