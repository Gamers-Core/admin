'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { ProductSchema, BackendError, Product, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateProductsQuery } from './useProductsQuery';
import { useSetProductData } from './useProductQuery';

interface UpdateProductMutationOptions extends ProductSchema {
  id: number;
}

interface UpdateProductMutationData extends Omit<ProductSchema, 'media'> {
  mediaIds: number[];
}

export const useUpdateProductMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateProductsQuery = useInvalidateProductsQuery();
  const setProductData = useSetProductData();

  return useMutation<Product, BackendError<ValidationErrors<keyof ProductSchema>> | null, UpdateProductMutationOptions>(
    {
      mutationFn: ({ id, media, ...data }) =>
        gamersCoreAdmin
          .patch<Product, AxiosResponse<Product>, UpdateProductMutationData>(`/products/${id}`, {
            ...data,
            mediaIds: media.map(({ id }) => id),
          })
          .then((res) => res.data)
          .catch((err: AxiosError<BackendError>) => {
            throw errorHandler(err);
          }),
      onSuccess: (data, variables) => {
        invalidateProductsQuery();

        setProductData(variables.id, data);
      },
    },
  );
};
