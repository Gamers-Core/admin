'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { AuthPurpose, BackendError, gamersCore, ValidationErrors, VerifyOTPResponse, VerifyOTPSchema } from '@/api';

import { useErrorHandler } from '../useErrorHandler';

interface VerifyOTPMutationParams extends VerifyOTPSchema {
  sessionId: string;
}

export const useVerifyOTPMutation = <P extends AuthPurpose = AuthPurpose>() => {
  const errorHandler = useErrorHandler();

  return useMutation<
    VerifyOTPResponse[P],
    BackendError<ValidationErrors<keyof VerifyOTPSchema>> | null,
    VerifyOTPMutationParams
  >({
    mutationFn: (data) =>
      gamersCore
        .post<VerifyOTPResponse[P], AxiosResponse<VerifyOTPResponse[P]>, VerifyOTPMutationParams>(
          '/auth/verify-otp',
          data,
        )
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
  });
};
