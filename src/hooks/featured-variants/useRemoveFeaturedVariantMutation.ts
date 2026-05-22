'use client';

import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, FeaturedVariant, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetFeaturedVariantsQueryData } from './useFeaturedVariantsQuery';

export const useRemoveFeaturedVariantMutation = () => {
  const errorHandler = useErrorHandler();

  const setFeaturedVariantsQueryData = useSetFeaturedVariantsQueryData();

  return useMutation<FeaturedVariant[], BackendError | null, number>({
    mutationFn: (featuredVariantId) =>
      gamersCoreAdmin
        .delete<FeaturedVariant[]>(`/featured-variants/${featuredVariantId}`)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setFeaturedVariantsQueryData(data);
    },
  });
};
