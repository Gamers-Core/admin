'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import {
  AppSettings,
  AppSettingsKey,
  AppSettingsSchemas,
  BackendError,
  gamersCoreAdmin,
  ValidationErrors,
} from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateAppSettingsQuery } from './useAppSettingsQuery';
import { useSetAppSettingData } from './useAppSettingQuery';

interface AppSettingsSchemaWithMediaIds extends Omit<AppSettingsSchemas[AppSettingsKey], 'media'> {
  mediaIds: number[] | undefined;
}

export const useSetAppSettingsMutation = <S extends AppSettingsKey>(setting: S) => {
  const errorHandler = useErrorHandler();

  const invalidateAppSettingsQuery = useInvalidateAppSettingsQuery();
  const setAppSettingData = useSetAppSettingData();

  return useMutation<
    AppSettings[S],
    BackendError<ValidationErrors<Extract<keyof AppSettingsSchemas[S], string>>> | null,
    AppSettingsSchemas[S]
  >({
    mutationFn: (data) =>
      gamersCoreAdmin
        .put<AppSettings[S], AxiosResponse<AppSettings[S]>, AppSettingsSchemaWithMediaIds>(`/settings/${setting}`, {
          ...data,
          mediaIds: 'media' in data && data.media?.length ? data.media.map(({ id }) => id) : undefined,
        })
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      invalidateAppSettingsQuery();
      setAppSettingData(setting, data);
    },
  });
};
