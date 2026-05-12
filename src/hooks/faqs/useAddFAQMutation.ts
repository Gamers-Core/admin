'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, ValidationErrors, gamersCoreAdmin, FAQ, FAQSchema } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetFAQsQueryData } from './useFAQsQuery';

export const useAddFAQMutation = () => {
  const errorHandler = useErrorHandler();

  const setFAQsQueryData = useSetFAQsQueryData();

  return useMutation<FAQ[], BackendError<ValidationErrors<keyof FAQSchema>> | null, FAQSchema>({
    mutationFn: (data) =>
      gamersCoreAdmin
        .post<FAQ[], AxiosResponse<FAQ[]>, FAQSchema>('/faqs', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setFAQsQueryData(data);
    },
  });
};
