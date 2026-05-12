'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, UserReview, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetUserReviewsQueryData } from './useUserReviewsQuery';

export const useReorderUserReviewMutation = () => {
  const errorHandler = useErrorHandler();

  const setUserReviewsQueryData = useSetUserReviewsQueryData();

  return useMutation<UserReview[], BackendError | null, number[]>({
    mutationFn: (ids) =>
      gamersCoreAdmin
        .patch<UserReview[], AxiosResponse<UserReview[]>, { ids: number[] }>('/user-reviews/reorder', { ids })
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setUserReviewsQueryData(data);
    },
  });
};
