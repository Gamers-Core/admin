import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, FeaturedVariant, gamersCoreAdmin } from '@/api';

const queryKey = ['featured-variants'] as const;

const queryFn = async () => gamersCoreAdmin.get<FeaturedVariant[]>('/featured-variants').then((res) => res.data);

export const useFeaturedVariantsQuery = () =>
  useQuery<FeaturedVariant[], AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
  });

export const useInvalidateFeaturedVariantsQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey });
};

export const useSetFeaturedVariantsQueryData = () => {
  const queryClient = useQueryClient();

  return (featuredVariants: FeaturedVariant[]) => queryClient.setQueryData(queryKey, featuredVariants);
};

useFeaturedVariantsQuery.queryKey = queryKey;
useFeaturedVariantsQuery.queryFn = queryFn;
