import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { BackendError, gamersCoreAdmin, Order, SearchOrderSchema } from '@/api';

const queryKey = (searchOptions: SearchOrderSchema = {}) =>
  ['orders', ...Object.entries(searchOptions).sort(([a], [b]) => a.localeCompare(b))] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, ...paramsArr] }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin
    .get<Order[], AxiosResponse<Order[]>>('/orders', { params: Object.fromEntries(paramsArr) })
    .then((res) => res.data);

export const useOrdersQuery = (searchOptions: SearchOrderSchema = {}) =>
  useQuery<Order[], AxiosError<BackendError>, Order[], QueryKey>({
    queryKey: queryKey(searchOptions),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useInvalidateOrdersQuery = (searchOptions: SearchOrderSchema = {}) => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: queryKey(searchOptions) });
};

useOrdersQuery.queryKey = queryKey;
useOrdersQuery.queryFn = queryFn;
