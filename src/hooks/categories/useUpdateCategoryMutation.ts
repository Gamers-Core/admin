'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, Category, CategorySchema, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateCategoriesQuery } from './useCategoriesQuery';

interface UpdateCategoryMutationOptions extends CategorySchema {
  id: number;
}

export const useUpdateCategoryMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateCategoriesQuery = useInvalidateCategoriesQuery();

  return useMutation<
    Category,
    BackendError<ValidationErrors<keyof CategorySchema>> | null,
    UpdateCategoryMutationOptions
  >({
    mutationFn: ({ id, ...data }) =>
      gamersCoreAdmin
        .patch<Category, AxiosResponse<Category>, CategorySchema>(`/categories/${id}`, data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateCategoriesQuery();
    },
  });
};
