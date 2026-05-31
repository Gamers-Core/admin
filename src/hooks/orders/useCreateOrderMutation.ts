'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { AddOrderItemSchema, BackendError, CreateOrderSchema, Order, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetOrderQueryData } from './useOrderQuery';
import { useInvalidateOrdersQuery } from './useOrdersQuery';
import { useInvalidateProductsQuery } from '../products';

interface CreateOrderMutationData extends Omit<CreateOrderSchema, 'variants' | 'user'> {
  userId: number;
  addressId: number;
  variants: AddOrderItemSchema[];
}

export const useCreateOrderMutation = () => {
  const errorHandler = useErrorHandler();

  const setOrderQueryData = useSetOrderQueryData();
  const invalidateOrdersQuery = useInvalidateOrdersQuery();
  const invalidateProductsQuery = useInvalidateProductsQuery();

  return useMutation<Order, BackendError<ValidationErrors<keyof CreateOrderSchema>> | null, CreateOrderSchema>({
    mutationFn: ({ user, variants, ...data }) =>
      gamersCoreAdmin
        .post<Order, AxiosResponse<Order>, CreateOrderMutationData>('/orders', {
          ...data,
          userId: user.id,
          addressId: user.addresses.find(({ isDefault }) => isDefault)?.id ?? user.addresses[0]?.id ?? 0,
          variants: variants.map(({ externalId, quantity }) => ({ externalId, quantity })),
        })
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
