'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { AddProductSchema, BackendError, Product, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateProductsQuery } from './useProductsQuery';

export const useAddProductMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateProductsQuery = useInvalidateProductsQuery();

  return useMutation<Product[], BackendError<ValidationErrors<keyof AddProductSchema>> | null, AddProductSchema>({
    mutationFn: (data) =>
      gamersCoreAdmin
        .post<Product[], AxiosResponse<Product[]>, AddProductSchema>('/products', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateProductsQuery();
    },
  });
};
