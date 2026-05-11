'use client';

import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateBrandsQuery } from './useBrandsQuery';

export const useRemoveBrandMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateBrandsQuery = useInvalidateBrandsQuery();

  return useMutation<{ deleted: boolean }, BackendError | null, number>({
    mutationFn: (brandId) =>
      gamersCoreAdmin
        .delete<{ deleted: boolean }>(`/brands/${brandId}`)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateBrandsQuery();
    },
  });
};
