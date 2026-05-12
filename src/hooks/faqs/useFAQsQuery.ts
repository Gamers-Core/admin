import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, FAQ, gamersCoreAdmin } from '@/api';

const queryKey = ['faqs'] as const;

const queryFn = async () => gamersCoreAdmin.get<FAQ[]>('/faqs').then((res) => res.data);

export const useFAQsQuery = () =>
  useQuery<FAQ[], AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
  });

export const useInvalidateFAQsQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey });
};

useFAQsQuery.queryKey = queryKey;
useFAQsQuery.queryFn = queryFn;
