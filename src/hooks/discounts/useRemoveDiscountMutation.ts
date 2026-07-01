'use client';

import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateDiscountsQuery } from './useDiscountsQuery';

export const useRemoveDiscountMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateDiscountsQuery = useInvalidateDiscountsQuery();

  return useMutation<void, BackendError | null, number>({
    mutationFn: (id) =>
      gamersCoreAdmin
        .delete<void>(`/discounts/${id}`)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateDiscountsQuery();
    },
  });
};
