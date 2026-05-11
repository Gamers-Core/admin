import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, Brand, gamersCoreAdmin } from '@/api';

const queryKey = ['brands'] as const;

const queryFn = async () => gamersCoreAdmin.get<Brand[]>('/brands').then((res) => res.data);

export const useBrandsQuery = () =>
  useQuery<Brand[], AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
  });

export const useInvalidateBrandsQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey });
};

useBrandsQuery.queryKey = queryKey;
useBrandsQuery.queryFn = queryFn;
