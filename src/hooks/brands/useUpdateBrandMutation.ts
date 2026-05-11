'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, Brand, UpdateBrandSchema, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateBrandsQuery } from './useBrandsQuery';

interface UpdateBrandMutationOptions extends UpdateBrandSchema {
  id: number;
}

export const useUpdateBrandMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateBrandsQuery = useInvalidateBrandsQuery();

  return useMutation<Brand, BackendError<ValidationErrors<keyof UpdateBrandSchema>> | null, UpdateBrandMutationOptions>(
    {
      mutationFn: ({ id, ...data }) =>
        gamersCoreAdmin
          .patch<Brand, AxiosResponse<Brand>, UpdateBrandSchema>('/brands/' + id, data)
          .then((res) => res.data)
          .catch((err: AxiosError<BackendError>) => {
            throw errorHandler(err);
          }),
      onSuccess: () => {
        invalidateBrandsQuery();
      },
    },
  );
};
