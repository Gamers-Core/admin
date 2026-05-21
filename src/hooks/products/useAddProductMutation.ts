'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { ProductSchema, BackendError, Product, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateProductsQuery } from './useProductsQuery';

interface AddProductMutationData extends Omit<ProductSchema, 'media'> {
  mediaIds: number[];
}

export const useAddProductMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateProductsQuery = useInvalidateProductsQuery();

  return useMutation<Product, BackendError<ValidationErrors<keyof ProductSchema>> | null, ProductSchema>({
    mutationFn: ({ media, ...data }) =>
      gamersCoreAdmin
        .post<Product, AxiosResponse<Product>, AddProductMutationData>('/products', {
          ...data,
          mediaIds: media.map(({ id }) => id),
        })
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateProductsQuery();
    },
  });
};
