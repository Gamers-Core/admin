import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { BackendError, gamersCoreAdmin, DiscountUsage } from '@/api';

const queryKey = (id: number) => ['discount', 'usage', id] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, , id] }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin.get<DiscountUsage[]>(`/discounts/${id}/usages`).then((res) => res.data);

export const useDiscountUsagesQuery = (id: number) =>
  useQuery<DiscountUsage[], BackendError, DiscountUsage[], QueryKey>({
    queryKey: queryKey(id),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

useDiscountUsagesQuery.queryKey = queryKey;
useDiscountUsagesQuery.queryFn = queryFn;
