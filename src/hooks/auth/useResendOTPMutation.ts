'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCore, OTPFlowResponse, ValidationErrors } from '@/api';

import { useErrorHandler } from '../useErrorHandler';

export const useResendOTPMutation = () => {
  const errorHandler = useErrorHandler();

  return useMutation<never, BackendError<ValidationErrors<never>> | null, OTPFlowResponse>({
    mutationFn: (data) =>
      gamersCore
        .post<never, AxiosResponse<never>, OTPFlowResponse>('/auth/resend-otp', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
  });
};
