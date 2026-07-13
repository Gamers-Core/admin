import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { BackendError, gamersCoreAdmin, Discount, SearchDiscountSchema } from '@/api';

const queryKey = (searchOptions: SearchDiscountSchema = {}) =>
  ['discounts', ...Object.entries(searchOptions).sort(([a], [b]) => a.localeCompare(b))] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, ...paramsArr] }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin
    .get<Discount[], AxiosResponse<Discount[]>>('/discounts', { params: Object.fromEntries(paramsArr) })
    .then((res) => res.data);

export const useDiscountsQuery = (searchOptions: SearchDiscountSchema = {}, enabled = true) =>
  useQuery<Discount[], AxiosError<BackendError>, Discount[], QueryKey>({
    queryKey: queryKey(searchOptions),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
  });

export const useInvalidateDiscountsQuery = (searchOptions: SearchDiscountSchema = {}) => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: queryKey(searchOptions) });
};

useDiscountsQuery.queryKey = queryKey;
useDiscountsQuery.queryFn = queryFn;
