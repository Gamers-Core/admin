import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, gamersCoreAdmin, Order } from '@/api';

const queryKey = (orderNumber: string) => ['order', orderNumber] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, orderNumber] }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin.get<Order>(`/orders/${orderNumber}`).then((res) => res.data);

export const useOrderQuery = (orderNumber: string) =>
  useQuery<Order, AxiosError<BackendError>, Order, QueryKey>({
    queryKey: queryKey(orderNumber),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

export const useSetOrderQueryData = () => {
  const queryClient = useQueryClient();

  return (orderNumber: string, data: Order) => queryClient.setQueryData(queryKey(orderNumber), data);
};

useOrderQuery.queryKey = queryKey;
useOrderQuery.queryFn = queryFn;
