'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, Order, PaymentStatus, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetOrderQueryData } from './useOrderQuery';

interface UpdateOrderPaymentStatusData {
  paymentStatus: PaymentStatus;
}

interface UpdateOrderPaymentStatusMutationOptions extends UpdateOrderPaymentStatusData {
  orderNumber: string;
}

export const useUpdateOrderPaymentStatusMutation = () => {
  const errorHandler = useErrorHandler();

  const setOrderQueryData = useSetOrderQueryData();

  return useMutation<Order, BackendError | null, UpdateOrderPaymentStatusMutationOptions>({
    mutationFn: ({ orderNumber, paymentStatus }) =>
      gamersCoreAdmin
        .patch<Order, AxiosResponse<Order>, UpdateOrderPaymentStatusData>(`/orders/${orderNumber}/payment-status`, {
          paymentStatus,
        })
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setOrderQueryData(data.orderNumber, data);
    },
  });
};
