'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { DiscountSchema, BackendError, Discount, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateDiscountsQuery } from './useDiscountsQuery';
import { useSetDiscountData } from './useDiscountQuery';

interface UpdateDiscountMutationParams extends DiscountSchema {
  id: number;
}

interface UpdateDiscountMutationOptions extends Omit<
  DiscountSchema,
  'variants' | 'categories' | 'brands' | 'eligibleUsers'
> {
  variantIds?: number[];
  categoryIds?: number[];
  brandIds?: number[];
  eligibleUserIds?: number[];
}

export const useUpdateDiscountMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateDiscountsQuery = useInvalidateDiscountsQuery();
  const setDiscountData = useSetDiscountData();

  return useMutation<
    Discount,
    BackendError<ValidationErrors<keyof DiscountSchema>> | null,
    UpdateDiscountMutationParams
  >({
    mutationFn: ({ id, variants, categories, brands, eligibleUsers, ...data }) =>
      gamersCoreAdmin
        .patch<Discount, AxiosResponse<Discount>, UpdateDiscountMutationOptions>(`/discounts/${id}`, {
          ...data,
          variantIds: variants?.map((variant) => variant.id),
          categoryIds: categories?.map((category) => category.id),
          brandIds: brands?.map((brand) => brand.id),
          eligibleUserIds: eligibleUsers?.map((user) => user.id) ?? [],
        })
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data, variables) => {
      invalidateDiscountsQuery();

      setDiscountData(variables.id, data);
    },
  });
};
