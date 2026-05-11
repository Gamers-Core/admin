'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, ValidationErrors, gamersCoreAdmin, Category, CategorySchema } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateCategoriesQuery } from './useCategoriesQuery';

export const useAddCategoryMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateCategoriesQuery = useInvalidateCategoriesQuery();

  return useMutation<Category, BackendError<ValidationErrors<keyof CategorySchema>> | null, CategorySchema>({
    mutationFn: (data) =>
      gamersCoreAdmin
        .post<Category, AxiosResponse<Category>, CategorySchema>('/categories', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateCategoriesQuery();
    },
  });
};
