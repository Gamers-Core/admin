'use client';

import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateCategoriesQuery } from './useCategoriesQuery';

export const useRemoveCategoryMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateCategoriesQuery = useInvalidateCategoriesQuery();

  return useMutation<{ deleted: boolean }, BackendError | null, number>({
    mutationFn: (categoryId) =>
      gamersCoreAdmin
        .delete<{ deleted: boolean }>(`/categories/${categoryId}`)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateCategoriesQuery();
    },
  });
};
