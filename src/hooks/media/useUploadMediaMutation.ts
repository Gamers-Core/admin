'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { AppError, BackendError, gamersCore, MediaByFolder, MediaFolder } from '@/api';
import { useUploadMediaStore } from '@/stores';

export const useUploadMediaMutation = <F extends MediaFolder>(folder: F) => {
  const setUploading = useUploadMediaStore((state) => state.setUploading);
  const setSuccess = useUploadMediaStore((state) => state.setSuccess);
  const setError = useUploadMediaStore((state) => state.setError);
  const getFileState = useUploadMediaStore((state) => state.getFileState);

  return useMutation<MediaByFolder<F>, AxiosError<BackendError<AppError>>, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const fileState = getFileState(file);

      return gamersCore
        .post<MediaByFolder<F>, AxiosResponse<MediaByFolder<F>>, FormData>('/media', formData, {
          signal: fileState?.abort?.signal,
          timeout: 5 * 60 * 1000,
        })
        .then((res) => res.data);
    },
    onMutate: (file) => {
      setUploading(file);
    },
    onSuccess: (data, file) => setSuccess(file, data),
    onError: (err, file) => {
      if (!err) return;

      setError(file, err.response?.data.message ?? err.message ?? 'An unknown error occurred. Please try again.');
    },
    retry: false,
  });
};
