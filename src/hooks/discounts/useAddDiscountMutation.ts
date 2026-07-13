'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { DiscountSchema, BackendError, Discount, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateDiscountsQuery } from './useDiscountsQuery';

interface AddDiscountMutationOptions extends Omit<
  DiscountSchema,
  'variants' | 'categories' | 'brands' | 'eligibleUsers'
> {
  variantIds: number[];
  categoryIds: number[];
  brandIds: number[];
  eligibleUserIds: number[];
}

export const useAddDiscountMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateDiscountsQuery = useInvalidateDiscountsQuery();

  return useMutation<Discount, BackendError<ValidationErrors<keyof DiscountSchema>> | null, DiscountSchema>({
    mutationFn: ({ variants, categories, brands, eligibleUsers, ...data }) =>
      gamersCoreAdmin
        .post<Discount, AxiosResponse<Discount>, AddDiscountMutationOptions>('/discounts', {
          ...data,
          variantIds: variants?.map((variant) => variant.id) ?? [],
          categoryIds: categories?.map((category) => category.id) ?? [],
          brandIds: brands?.map((brand) => brand.id) ?? [],
          eligibleUserIds: eligibleUsers?.map((user) => user.id) ?? [],
        })
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateDiscountsQuery();
    },
  });
};
