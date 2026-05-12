import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, UserReview, gamersCoreAdmin } from '@/api';

const queryKey = ['user-reviews'] as const;

const queryFn = async () => gamersCoreAdmin.get<UserReview[]>('/user-reviews').then((res) => res.data);

export const useUserReviewsQuery = () =>
  useQuery<UserReview[], AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
  });

export const useSetUserReviewsQueryData = () => {
  const queryClient = useQueryClient();

  return (userReviews: UserReview[]) => queryClient.setQueryData(queryKey, userReviews);
};

useUserReviewsQuery.queryKey = queryKey;
useUserReviewsQuery.queryFn = queryFn;
