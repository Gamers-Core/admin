'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, FAQ, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetFAQsQueryData } from './useFAQsQuery';

export const useReorderFAQMutation = () => {
  const errorHandler = useErrorHandler();

  const setFAQsQueryData = useSetFAQsQueryData();

  return useMutation<FAQ[], BackendError | null, number[]>({
    mutationFn: (ids) =>
      gamersCoreAdmin
        .patch<FAQ[], AxiosResponse<FAQ[]>, { ids: number[] }>('/faqs/reorder', { ids })
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setFAQsQueryData(data);
    },
  });
};
