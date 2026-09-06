import { InfiniteData, QueryFunctionContext, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { Discount, BackendError, gamersCoreAdmin, Pagination, PaginationParams, SearchDiscountSchema } from '@/api';

const queryKey = (searchOptions: DiscountsInfiniteQueryParams = {}) =>
  ['discounts', ...Object.entries(searchOptions).sort(([a], [b]) => a.localeCompare(b))] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, ...paramsArr], pageParam }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin
    .get<Pagination<Discount>, AxiosResponse<Pagination<Discount>>>('/discounts', {
      params: { limit: 26, ...Object.fromEntries(paramsArr), page: pageParam },
    })
    .then((res) => res.data);

type DiscountsInfiniteQueryParams = SearchDiscountSchema & PaginationParams;

export const useDiscountsInfiniteQuery = (searchOptions: DiscountsInfiniteQueryParams = {}, enabled = true) =>
  useInfiniteQuery<Pagination<Discount>, AxiosError<BackendError>, InfiniteData<Pagination<Discount>>, QueryKey>({
    queryKey: queryKey(searchOptions),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : undefined,
    initialPageParam: 1,
  });

export const useInvalidateDiscountsQuery = (searchOptions: DiscountsInfiniteQueryParams = {}) => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: queryKey(searchOptions) });
};

useDiscountsInfiniteQuery.queryKey = queryKey;
useDiscountsInfiniteQuery.queryFn = queryFn;
