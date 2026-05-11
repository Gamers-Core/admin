'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, Brand, BrandSchema, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateBrandsQuery } from './useBrandsQuery';

export const useAddBrandMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateBrandsQuery = useInvalidateBrandsQuery();

  return useMutation<Brand, BackendError<ValidationErrors<keyof BrandSchema>> | null, BrandSchema>({
    mutationFn: (data) =>
      gamersCoreAdmin
        .post<Brand, AxiosResponse<Brand>, BrandSchema>('/brands', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateBrandsQuery();
    },
  });
};
