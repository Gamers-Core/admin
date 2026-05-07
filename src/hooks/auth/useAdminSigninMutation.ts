'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCore, OTPFlowResponse, SigninSchema, ValidationErrors } from '@/api';

import { useErrorHandler } from '../useErrorHandler';

export const useAdminSigninMutation = () => {
  const errorHandler = useErrorHandler();

  return useMutation<OTPFlowResponse, BackendError<ValidationErrors<keyof SigninSchema>> | null, SigninSchema>({
    mutationFn: (data) =>
      gamersCore
        .post<OTPFlowResponse, AxiosResponse<OTPFlowResponse>, SigninSchema>('/auth/admin/signin', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
  });
};
