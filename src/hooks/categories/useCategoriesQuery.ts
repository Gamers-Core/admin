import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, Category, gamersCoreAdmin } from '@/api';

const queryKey = ['categories'] as const;

const queryFn = async () => gamersCoreAdmin.get<Category[]>('/categories').then((res) => res.data);

export const useCategoriesQuery = () =>
  useQuery<Category[], AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
  });

export const useInvalidateCategoriesQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey });
};

useCategoriesQuery.queryKey = queryKey;
useCategoriesQuery.queryFn = queryFn;
