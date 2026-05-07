'use client';

import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { BackendError, gamersCore } from '@/api';
import { useAuthStore } from '@/stores';

import { useErrorHandler } from '../useErrorHandler';

interface LogoutResponse {
  isLoggedIn: false;
}

export const useLogoutMutation = () => {
  const router = useRouter();

  const errorHandler = useErrorHandler();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation<LogoutResponse, BackendError | null>({
    mutationFn: () =>
      gamersCore
        .post<LogoutResponse>('/auth/logout')
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      clearAuth();

      router.push('/signin');
    },
  });
};
