'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCore } from '@/api';

import { useErrorHandler } from '../useErrorHandler';

export const useRemoveMediaMutation = () => {
  const errorHandler = useErrorHandler();

  return useMutation<void, BackendError | null, number>({
    mutationFn: (id) =>
      gamersCore
        .delete<void, AxiosResponse<void>, number>(`/media/${id}`)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
  });
};
