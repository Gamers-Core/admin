import { InfiniteData, QueryFunctionContext, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { Order, BackendError, gamersCoreAdmin, Pagination, PaginationParams, SearchOrderSchema } from '@/api';

const queryKey = (searchOptions: OrdersInfiniteQueryParams = {}) =>
  ['orders', ...Object.entries(searchOptions).sort(([a], [b]) => a.localeCompare(b))] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, ...paramsArr], pageParam }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin
    .get<Pagination<Order>, AxiosResponse<Pagination<Order>>>('/orders', {
      params: { page: pageParam, limit: 18, ...Object.fromEntries(paramsArr) },
    })
    .then((res) => res.data);

type OrdersInfiniteQueryParams = SearchOrderSchema & PaginationParams;

export const useOrdersInfiniteQuery = (searchOptions: OrdersInfiniteQueryParams = {}, enabled = true) =>
  useInfiniteQuery<Pagination<Order>, AxiosError<BackendError>, InfiniteData<Pagination<Order>>, QueryKey>({
    queryKey: queryKey(searchOptions),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : undefined,
    initialPageParam: 1,
  });

export const useInvalidateOrdersQuery = (searchOptions: OrdersInfiniteQueryParams = {}) => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: queryKey(searchOptions) });
};

useOrdersInfiniteQuery.queryKey = queryKey;
useOrdersInfiniteQuery.queryFn = queryFn;
