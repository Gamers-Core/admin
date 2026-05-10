'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, Brand, AddBrandSchema, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateBrandsQuery } from './useBrandsQuery';

export const useAddBrandMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateBrandsQuery = useInvalidateBrandsQuery();

  return useMutation<Brand, BackendError<ValidationErrors<keyof AddBrandSchema>> | null, AddBrandSchema>({
    mutationFn: (data) =>
      gamersCoreAdmin
        .post<Brand, AxiosResponse<Brand>, AddBrandSchema>('/brands', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateBrandsQuery();
    },
  });
};
