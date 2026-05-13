import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, Policies, gamersCoreAdmin } from '@/api';

const queryKey = ['policies'] as const;

const queryFn = async () => gamersCoreAdmin.get<Policies>('/policies').then((res) => res.data);

export const usePoliciesQuery = () =>
  useQuery<Policies, AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
  });

export const useInvalidatePoliciesQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey });
};

usePoliciesQuery.queryKey = queryKey;
usePoliciesQuery.queryFn = queryFn;
