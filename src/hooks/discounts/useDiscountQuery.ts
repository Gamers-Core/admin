import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';

import { BackendError, gamersCoreAdmin, Discount } from '@/api';

const queryKey = (id: number) => ['discount', id] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, id] }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin.get<Discount>(`/discounts/${id}`).then((res) => res.data);

export const useDiscountQuery = (id: number) =>
  useQuery<Discount, BackendError, Discount, QueryKey>({
    queryKey: queryKey(id),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

export const useSetDiscountData = () => {
  const queryClient = useQueryClient();

  return (id: number, data: Discount) => queryClient.setQueryData(queryKey(id), data);
};

useDiscountQuery.queryKey = queryKey;
useDiscountQuery.queryFn = queryFn;
