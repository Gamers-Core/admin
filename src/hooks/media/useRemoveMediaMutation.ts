'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCore } from '@/api';

export const useRemoveMediaMutation = () =>
  useMutation<void, AxiosError<BackendError>, number>({
    mutationFn: (id) => gamersCore.delete<void, AxiosResponse<void>, number>(`/media/${id}`).then((res) => res.data),
  });
