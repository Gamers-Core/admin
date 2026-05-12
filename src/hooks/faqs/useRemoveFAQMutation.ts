'use client';

import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, FAQ, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetFAQsQueryData } from './useFAQsQuery';

export const useRemoveFAQMutation = () => {
  const errorHandler = useErrorHandler();

  const setFAQsQueryData = useSetFAQsQueryData();

  return useMutation<FAQ[], BackendError | null, number>({
    mutationFn: (faqId) =>
      gamersCoreAdmin
        .delete<FAQ[]>(`/faqs/${faqId}`)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setFAQsQueryData(data);
    },
  });
};
