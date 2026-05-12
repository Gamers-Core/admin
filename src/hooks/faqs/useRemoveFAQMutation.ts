'use client';

import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateFAQsQuery } from './useFAQsQuery';

export const useRemoveFAQMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateFAQsQuery = useInvalidateFAQsQuery();

  return useMutation<{ deleted: boolean }, BackendError | null, number>({
    mutationFn: (faqId) =>
      gamersCoreAdmin
        .delete<{ deleted: boolean }>(`/faqs/${faqId}`)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateFAQsQuery();
    },
  });
};
