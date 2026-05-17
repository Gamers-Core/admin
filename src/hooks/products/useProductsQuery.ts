import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { BackendError, gamersCoreAdmin, Product } from '@/api';

const queryKey = ['products'] as const;

const queryFn = () => gamersCoreAdmin.get<Product[], AxiosResponse<Product[]>>('/products').then((res) => res.data);

export const useProductsQuery = () =>
  useQuery<Product[], BackendError>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useInvalidateProductsQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey });
};

useProductsQuery.queryKey = queryKey;
useProductsQuery.queryFn = queryFn;
