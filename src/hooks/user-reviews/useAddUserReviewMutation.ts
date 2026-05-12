'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, ValidationErrors, gamersCoreAdmin, UserReview, UserReviewSchema } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetUserReviewsQueryData } from './useUserReviewsQuery';

export const useAddUserReviewMutation = () => {
  const errorHandler = useErrorHandler();

  const setUserReviewsQueryData = useSetUserReviewsQueryData();

  return useMutation<UserReview[], BackendError<ValidationErrors<keyof UserReviewSchema>> | null, UserReviewSchema>({
    mutationFn: (data) =>
      gamersCoreAdmin
        .post<UserReview[], AxiosResponse<UserReview[]>, UserReviewSchema>('/user-reviews', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setUserReviewsQueryData(data);
    },
  });
};
