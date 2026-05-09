'use client';

import { useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';

import { useUploadMediaStore } from '@/stores';
import { MediaFolder, mediaFoldersTypeMap, mediaTypes } from '@/api';

import { useRemoveMediaMutation } from './useRemoveMediaMutation';

export const MAX_SIZE_MB = 100;
export const MAX_FILES = 10;

export const useUploadMedia = <F extends MediaFolder>(folder: F) => {
  const folderMediaTypes = mediaFoldersTypeMap[folder];
  const supportedTypes = useMemo(
    () => (folderMediaTypes === 'all' ? mediaTypes : ([folderMediaTypes] as const)),
    [folderMediaTypes],
  );
  const isMultiple = folderMediaTypes === 'all';

  const files = useUploadMediaStore((state) => state.files);
  const getFileState = useUploadMediaStore((state) => state.getFileState);
  const removeFile = useUploadMediaStore((state) => state.removeFile);
  const addFiles = useUploadMediaStore((state) => state.addFiles);
  const resetStore = useUploadMediaStore((state) => state.reset);

  const removeMutation = useRemoveMediaMutation();

  const validateFile = useCallback(
    (file: File) => {
      if (!isMultiple && files.length >= 1) return 'Only one file allowed';
      if (isMultiple && files.length >= MAX_FILES) return `Max ${MAX_FILES} files allowed`;

      const isSupportedFormat = supportedTypes.some((type) => file.type.startsWith(type === 'raw' ? '' : type));
      if (!isSupportedFormat) return `Unsupported format. Allowed: ${supportedTypes.join(', ')}`;

      if (file.size / 1024 / 1024 > MAX_SIZE_MB) return `File too large. Max: ${MAX_SIZE_MB}MB`;

      return null;
    },
    [files.length, isMultiple, supportedTypes],
  );

  const onFilesChange = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return;

      const incoming = Array.from(fileList).slice(0, isMultiple ? MAX_FILES - files.length : 1);
      const validated: File[] = [];

      for (const file of incoming) {
        const error = validateFile(file);
        if (error) {
          toast.error(error, { description: file.name });
          continue;
        }

        validated.push(file);
      }

      if (!validated.length) return;

      addFiles(validated);

      return validated;
    },
    [addFiles, files.length, isMultiple, validateFile],
  );

  const onRemove = useCallback(
    (file: File) => {
      const entry = getFileState(file);
      if (!entry) return;

      if (entry.state === 'uploading') entry.abort.abort();

      removeFile(entry.file);

      if (entry.state !== 'success') return;

      removeMutation.mutate(entry.media.id);
    },
    [getFileState, removeFile, removeMutation],
  );

  const isUploading = files.some((f) => f.state === 'uploading');
  const isUploadingRef = useRef(isUploading);
  isUploadingRef.current = isUploading;
  const filesRef = useRef(files);
  filesRef.current = files;

  const clear = useCallback(() => {
    if (isUploadingRef.current) filesRef.current.filter((f) => f.state === 'uploading').forEach((f) => f.abort.abort());

    filesRef.current.filter((f) => f.state === 'success').forEach((f) => removeMutation.mutate(f.media.id));

    resetStore();
  }, [removeMutation, resetStore]);

  return { onRemove, onFilesChange, clear, supportedTypes, isMultiple, isUploading };
};
