'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, FeaturedVariant, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetFeaturedVariantsQueryData } from './useFeaturedVariantsQuery';

export const useReorderFeaturedVariantMutation = () => {
  const errorHandler = useErrorHandler();

  const setFeaturedVariantsQueryData = useSetFeaturedVariantsQueryData();

  return useMutation<FeaturedVariant[], BackendError | null, number[]>({
    mutationFn: (orderedIds) =>
      gamersCoreAdmin
        .patch<FeaturedVariant[], AxiosResponse<FeaturedVariant[]>, { orderedIds: number[] }>(
          '/featured-variants/reorder',
          { orderedIds },
        )
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setFeaturedVariantsQueryData(data);
    },
  });
};
