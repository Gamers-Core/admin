'use client';

import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateProductsQuery } from './useProductsQuery';

export const useRemoveProductMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateProductsQuery = useInvalidateProductsQuery();

  return useMutation<void, BackendError | null, number>({
    mutationFn: (id) =>
      gamersCoreAdmin
        .delete<void>(`/products/${id}`)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateProductsQuery();
    },
  });
};
