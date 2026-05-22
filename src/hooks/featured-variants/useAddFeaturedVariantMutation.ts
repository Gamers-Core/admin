'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, ValidationErrors, gamersCoreAdmin, FeaturedVariant, FeaturedVariantSchema } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateFeaturedVariantsQuery } from './useFeaturedVariantsQuery';

export const useAddFeaturedVariantMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateFeaturedVariantsQuery = useInvalidateFeaturedVariantsQuery();

  return useMutation<
    FeaturedVariant,
    BackendError<ValidationErrors<keyof FeaturedVariantSchema>> | null,
    FeaturedVariantSchema
  >({
    mutationFn: (data) =>
      gamersCoreAdmin
        .post<FeaturedVariant, AxiosResponse<FeaturedVariant>, FeaturedVariantSchema>('/featured-variants', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateFeaturedVariantsQuery();
    },
  });
};
