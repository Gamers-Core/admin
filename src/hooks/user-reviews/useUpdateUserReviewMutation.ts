'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, UserReview, UserReviewSchema, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetUserReviewsQueryData } from './useUserReviewsQuery';

interface UpdateUserReviewMutationOptions extends UserReviewSchema {
  position: number;
}

export const useUpdateUserReviewMutation = () => {
  const errorHandler = useErrorHandler();

  const setUserReviewsQueryData = useSetUserReviewsQueryData();

  return useMutation<
    UserReview[],
    BackendError<ValidationErrors<keyof UserReviewSchema>> | null,
    UpdateUserReviewMutationOptions
  >({
    mutationFn: ({ position, ...data }) =>
      gamersCoreAdmin
        .patch<UserReview[], AxiosResponse<UserReview[]>, UserReviewSchema>(`/user-reviews/${position}`, data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setUserReviewsQueryData(data);
    },
  });
};
