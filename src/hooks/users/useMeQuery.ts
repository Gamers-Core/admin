import { AxiosError, AxiosResponse } from 'axios';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';

import { BackendError, BasicUser, gamersCore } from '@/api';

const queryKey = ['me'] as const;

const queryFn = () => gamersCore.get<BasicUser, AxiosResponse<BasicUser>>('/users/me').then((res) => res.data);

export const useMeQuery = (enabled: boolean = false): UseQueryResult<BasicUser, AxiosError<BackendError>> => {
  return useQuery<BasicUser, AxiosError<BackendError>, BasicUser>({
    queryKey,
    queryFn,
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInvalidateMeQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey });
};

export const useSetMeQueryData = () => {
  const queryClient = useQueryClient();

  return (data: BasicUser | null) => queryClient.setQueryData(queryKey, data);
};

export const useClearMeQueryData = () => {
  const setMeQueryData = useSetMeQueryData();

  return () => {
    setMeQueryData(null);
  };
};

useMeQuery.queryKey = queryKey;
useMeQuery.queryFn = queryFn;
