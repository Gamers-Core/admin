import { InfiniteData, QueryFunctionContext, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { Product, BackendError, gamersCoreAdmin, Pagination, PaginationParams, SearchProductSchema } from '@/api';

const queryKey = (searchOptions: ProductsInfiniteQueryParams = {}) =>
  ['products', ...Object.entries(searchOptions).sort(([a], [b]) => a.localeCompare(b))] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, ...paramsArr], pageParam }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin
    .get<Pagination<Product>, AxiosResponse<Pagination<Product>>>('/products', {
      params: { page: pageParam, limit: 15, ...Object.fromEntries(paramsArr) },
    })
    .then((res) => res.data);

type ProductsInfiniteQueryParams = SearchProductSchema & PaginationParams;

export const useProductsInfiniteQuery = (searchOptions: ProductsInfiniteQueryParams = {}, enabled = true) =>
  useInfiniteQuery<Pagination<Product>, AxiosError<BackendError>, InfiniteData<Pagination<Product>>, QueryKey>({
    queryKey: queryKey(searchOptions),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : undefined,
    initialPageParam: 1,
  });

export const useInvalidateProductsQuery = (searchOptions: ProductsInfiniteQueryParams = {}) => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: queryKey(searchOptions) });
};

useProductsInfiniteQuery.queryKey = queryKey;
useProductsInfiniteQuery.queryFn = queryFn;
