import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, AppSettings, gamersCoreAdmin, AppSettingsKey } from '@/api';

const queryKey = <S extends AppSettingsKey>(setting: S) => ['settings', setting] as const;

type QueryKey<S extends AppSettingsKey> = ReturnType<typeof queryKey<S>>;

const queryFn = async <S extends AppSettingsKey>({ queryKey: [, setting] }: QueryFunctionContext<QueryKey<S>>) =>
  gamersCoreAdmin.get<AppSettings[S]>(`/settings/${setting}`).then((res) => res.data);

export const useAppSettingQuery = <S extends AppSettingsKey>(setting: S) =>
  useQuery<AppSettings[S], AxiosError<BackendError>, AppSettings[S], QueryKey<S>>({
    queryKey: queryKey(setting),
    queryFn: queryFn<S>,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useSetAppSettingData = () => {
  const queryClient = useQueryClient();

  return <S extends AppSettingsKey>(setting: S, data: AppSettings[S]) => {
    queryClient.setQueryData(queryKey(setting), data);
  };
};

useAppSettingQuery.queryKey = queryKey;
useAppSettingQuery.queryFn = queryFn;
