import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, Policy, PolicyType, gamersCoreAdmin } from '@/api';

const queryKey = (policyType: PolicyType) => ['policies', policyType] as const;

const queryFn = async ({ queryKey: [, policyType] }: QueryFunctionContext) =>
  gamersCoreAdmin.get<Policy[]>(`/policies/${policyType}/history`).then((res) => res.data);

export const usePolicyHistoryQuery = (policyType: PolicyType) =>
  useQuery<Policy[], AxiosError<BackendError>>({
    queryKey: queryKey(policyType),
    queryFn,
    retry: false,
  });

export const useInvalidatePolicyHistoryQuery = (policyType: PolicyType) => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: queryKey(policyType) });
};

usePolicyHistoryQuery.queryKey = queryKey;
usePolicyHistoryQuery.queryFn = queryFn;
