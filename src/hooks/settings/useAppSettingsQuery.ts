import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, AppSettings, gamersCoreAdmin } from '@/api';

const queryKey = ['settings'] as const;

const queryFn = async () => gamersCoreAdmin.get<AppSettings>('/settings').then((res) => res.data);

export const useAppSettingsQuery = () =>
  useQuery<AppSettings, AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useInvalidateAppSettingsQuery = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey });
  };
};

useAppSettingsQuery.queryKey = queryKey;
useAppSettingsQuery.queryFn = queryFn;
