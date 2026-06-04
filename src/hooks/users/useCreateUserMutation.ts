'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, CreateUserSchema, SearchUser, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateUsersQuery } from './useUsersQuery';

export const useCreateUserMutation = () => {
  const errorHandler = useErrorHandler();
  const invalidateUsersQuery = useInvalidateUsersQuery();

  return useMutation<SearchUser, BackendError<ValidationErrors<keyof CreateUserSchema>> | null, CreateUserSchema>({
    mutationFn: (data) =>
      gamersCoreAdmin
        .post<SearchUser, AxiosResponse<SearchUser>, CreateUserSchema>('/users', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateUsersQuery();
    },
  });
};
