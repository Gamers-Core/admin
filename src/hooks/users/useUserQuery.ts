import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, FullUser, gamersCoreAdmin } from '@/api';

const queryKey = (id: number) => ['user', id] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, id] }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin.get<FullUser>(`/users/${id}`).then((res) => res.data);

export const useUserQuery = (id: number) =>
  useQuery<FullUser, AxiosError<BackendError>, FullUser, QueryKey>({
    queryKey: queryKey(id),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useSetUserQueryData = () => {
  const queryClient = useQueryClient();

  return (id: number, data: FullUser) => queryClient.setQueryData(queryKey(id), data);
};

useUserQuery.queryKey = queryKey;
useUserQuery.queryFn = queryFn;
