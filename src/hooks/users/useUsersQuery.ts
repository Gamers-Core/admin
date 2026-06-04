import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { SearchUser, BackendError, SearchUsersSchema, gamersCoreAdmin } from '@/api';

const queryKey = (searchOptions: SearchUsersSchema = {}) =>
  ['users', ...Object.entries(searchOptions).sort(([a], [b]) => a.localeCompare(b))] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, ...paramsArr] }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin
    .get<SearchUser[], AxiosResponse<SearchUser[]>>('/users', { params: Object.fromEntries(paramsArr) })
    .then((res) => res.data);

export const useUsersQuery = (searchOptions: SearchUsersSchema = {}) =>
  useQuery<SearchUser[], AxiosError<BackendError>, SearchUser[], QueryKey>({
    queryKey: queryKey(searchOptions),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useInvalidateUsersQuery = (searchOptions: SearchUsersSchema = {}) => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: queryKey(searchOptions) });
};

useUsersQuery.queryKey = queryKey;
useUsersQuery.queryFn = queryFn;
