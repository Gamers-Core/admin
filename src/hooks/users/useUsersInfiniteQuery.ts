import { InfiniteData, QueryFunctionContext, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { SearchUser, BackendError, gamersCoreAdmin, Pagination, PaginationParams, SearchUsersSchema } from '@/api';

const queryKey = (searchOptions: UsersInfiniteQueryParams = {}) =>
  ['users', ...Object.entries(searchOptions).sort(([a], [b]) => a.localeCompare(b))] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, ...paramsArr], pageParam }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin
    .get<
      Pagination<SearchUser>,
      AxiosResponse<Pagination<SearchUser>>
    >('/users', { params: { limit: 26, ...Object.fromEntries(paramsArr), page: pageParam } })
    .then((res) => res.data);

type UsersInfiniteQueryParams = SearchUsersSchema & PaginationParams;

export const useUsersInfiniteQuery = (searchOptions: UsersInfiniteQueryParams = {}, enabled = true) =>
  useInfiniteQuery<Pagination<SearchUser>, AxiosError<BackendError>, InfiniteData<Pagination<SearchUser>>, QueryKey>({
    queryKey: queryKey(searchOptions),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : undefined,
    initialPageParam: 1,
  });

export const useInvalidateUsersQuery = (searchOptions: UsersInfiniteQueryParams = {}) => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: queryKey(searchOptions) });
};

useUsersInfiniteQuery.queryKey = queryKey;
useUsersInfiniteQuery.queryFn = queryFn;
