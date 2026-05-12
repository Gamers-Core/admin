'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, FAQ, FAQSchema, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateFAQsQuery } from './useFAQsQuery';

interface UpdateFAQMutationOptions extends FAQSchema {
  id: number;
}

export const useUpdateFAQMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateFAQsQuery = useInvalidateFAQsQuery();

  return useMutation<FAQ, BackendError<ValidationErrors<keyof FAQSchema>> | null, UpdateFAQMutationOptions>({
    mutationFn: ({ id, ...data }) =>
      gamersCoreAdmin
        .patch<FAQ, AxiosResponse<FAQ>, FAQSchema>(`/faqs/${id}`, data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateFAQsQuery();
    },
  });
};
