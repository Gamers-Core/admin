'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, FeaturedVariant, FeaturedVariantSchema, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateFeaturedVariantsQuery } from './useFeaturedVariantsQuery';

interface UpdateFeaturedVariantMutationOptions extends FeaturedVariantSchema {
  id: number;
}

export const useUpdateFeaturedVariantMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateFeaturedVariantsQuery = useInvalidateFeaturedVariantsQuery();

  return useMutation<
    FeaturedVariant,
    BackendError<ValidationErrors<keyof FeaturedVariantSchema>> | null,
    UpdateFeaturedVariantMutationOptions
  >({
    mutationFn: ({ id, ...data }) =>
      gamersCoreAdmin
        .patch<FeaturedVariant, AxiosResponse<FeaturedVariant>, FeaturedVariantSchema>(`/featured-variants/${id}`, data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateFeaturedVariantsQuery();
    },
  });
};
