'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, Order, OrderShippingSchema, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetOrderQueryData } from './useOrderQuery';

interface UpdateOrderShippingMutationOptions extends OrderShippingSchema {
  orderNumber: string;
}

export const useUpdateShippingMutation = () => {
  const errorHandler = useErrorHandler();

  const setOrderQueryData = useSetOrderQueryData();

  return useMutation<
    Order,
    BackendError<ValidationErrors<keyof OrderShippingSchema>> | null,
    UpdateOrderShippingMutationOptions
  >({
    mutationFn: ({ orderNumber, trackingNumber }) =>
      gamersCoreAdmin
        .patch<Order, AxiosResponse<Order>, OrderShippingSchema>(`/orders/${orderNumber}/shipping`, { trackingNumber })
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setOrderQueryData(data.orderNumber, data);
    },
  });
};
