'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, CreateUserSchema, FullUser, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateUsersQuery } from './useUsersQuery';
import { useSetUserQueryData } from './useUserQuery';

interface UpdateUserMutationOptions extends CreateUserSchema {
  id: number;
}

export const useUpdateUserMutation = () => {
  const errorHandler = useErrorHandler();
  const invalidateUsersQuery = useInvalidateUsersQuery();
  const setUserQueryData = useSetUserQueryData();

  return useMutation<
    FullUser,
    BackendError<ValidationErrors<keyof CreateUserSchema>> | null,
    UpdateUserMutationOptions
  >({
    mutationFn: ({ id, ...data }) =>
      gamersCoreAdmin
        .post<FullUser, AxiosResponse<FullUser>, CreateUserSchema>(`/users/${id}`, data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data, variables) => {
      invalidateUsersQuery();
      setUserQueryData(variables.id, data);
    },
  });
};
