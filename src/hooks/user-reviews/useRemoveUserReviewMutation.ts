'use client';

import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, UserReview, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetUserReviewsQueryData } from './useUserReviewsQuery';

export const useRemoveUserReviewMutation = () => {
  const errorHandler = useErrorHandler();

  const setUserReviewsQueryData = useSetUserReviewsQueryData();

  return useMutation<UserReview[], BackendError | null, number>({
    mutationFn: (position) =>
      gamersCoreAdmin
        .delete<UserReview[]>(`/user-reviews/${position}`)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setUserReviewsQueryData(data);
    },
  });
};
