import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { BackendError, gamersCoreAdmin, Product, SearchSchema } from '@/api';

const queryKey = (searchOptions: SearchSchema = {}) =>
  ['products', ...Object.entries(searchOptions).sort(([a], [b]) => a.localeCompare(b))] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, ...paramsArr] }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin
    .get<Product[], AxiosResponse<Product[]>>('/products', { params: Object.fromEntries(paramsArr) })
    .then((res) => res.data);

export const useProductsQuery = (searchOptions: SearchSchema = {}) =>
  useQuery<Product[], BackendError, Product[], QueryKey>({
    queryKey: queryKey(searchOptions),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useInvalidateProductsQuery = (searchOptions: SearchSchema = {}) => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: queryKey(searchOptions) });
};

useProductsQuery.queryKey = queryKey;
useProductsQuery.queryFn = queryFn;
