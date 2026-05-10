'use client';

import { useRef, useState } from 'react';
import { Refresh01Icon, Upload, X } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { MediaByFolder, MediaFolder, mediaRawFormats } from '@/api';
import { MAX_FILES, useUploadMedia, useUploadMediaMutation } from '@/hooks';
import { FileState, useUploadMediaStore } from '@/stores';
import { cn } from '@/lib/utils';
import { chunk } from '@/helpers';

import { Button } from './Button';
import { Image } from './Image';
import { Separator } from './ui';

interface UploadMediaProps<F extends MediaFolder> {
  folder: F;
  onSuccess?: (data: MediaByFolder<F>[]) => void;
  className?: string;
}

export const UploadMedia = <F extends MediaFolder>({ folder, onSuccess, className }: UploadMediaProps<F>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const uploadMutation = useUploadMediaMutation(folder);

  const files = useUploadMediaStore((state) => state.files);
  const { onFilesChange, onRemove, supportedTypes, isMultiple, isUploading } = useUploadMedia(folder);

  const canUpload = !isUploading && (isMultiple ? files.length < MAX_FILES : files.length < 1);

  const onFilesSelect = async (fileList: FileList | null) => {
    if (!fileList?.length || !canUpload) return;

    const validated = onFilesChange(fileList);
    if (!validated) return;

    const results: MediaByFolder<F>[] = [];
    const batches = chunk(validated, 2);

    for (const batch of batches) {
      await Promise.allSettled(
        batch.map((file) => uploadMutation.mutateAsync(file, { onSuccess: (media) => results.push(media) })),
      );
    }

    if (!results.length) return;

    onSuccess?.(results);
  };

  return (
    <div className={cn('flex w-full flex-col gap-3', className)}>
      <div
        title={canUpload ? 'Drag files to upload' : undefined}
        className="flex min-h-57.5 w-full flex-col gap-1.5"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingFile(false);
          onFilesSelect(e.dataTransfer.files);
        }}
      >
        <div
          className={cn(
            'flex min-h-57.5 flex-1 flex-col items-center gap-2 rounded-lg border border-dashed border-gray-920 bg-white-100 pt-14',
            {
              'cursor-not-allowed opacity-60 grayscale': !canUpload,
              'border-primary': isDraggingFile && canUpload,
              'bg-primary/20': isDraggingFile && canUpload,
            },
          )}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDraggingFile(true);
          }}
          onDragExit={(e) => {
            e.preventDefault();
            setIsDraggingFile(false);
          }}
        >
          <HugeiconsIcon icon={Upload} className="mb-2" />

          <p className={cn('text-sm font-normal text-black-300', { 'select-none text-gray-70': !canUpload })}>
            Drag and drop your {isMultiple ? 'files' : 'file'} here to upload.
          </p>

          <div className="flex justify-center items-center my-2 w-25">
            <Separator className="w-auto" />

            <span className={cn('bg-(--drag-over-bg) px-2 text-gray-600', { 'select-none': !canUpload })}>or</span>

            <Separator />
          </div>

          <Button
            variant="outline"
            className="h-auto cursor-pointer rounded-lg border border-gray-800 bg-transparent px-3 py-1.5 text-sm text-black-100 hover:text-black-100"
            onClick={() => inputRef.current?.click()}
            isDisabled={!canUpload}
          >
            <input
              ref={inputRef}
              type="file"
              hidden
              multiple={isMultiple}
              accept={supportedTypes.flatMap((f) => (f === 'raw' ? mediaRawFormats : [`${f}/*`])).join(',')}
              onChange={(e) => onFilesSelect(e.target.files)}
              disabled={!canUpload}
            />
            Browse Files
          </Button>
        </div>

        <p className="text-gray-750">
          Supported types: <span dir="auto">{supportedTypes.join(', ')}</span>
        </p>
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2 overflow-y-auto max-h-64">
          {files.map((entry, i) => (
            <UploadState key={i} {...entry} onRemove={onRemove} onRetry={uploadMutation.mutate} isRetrying={false} />
          ))}
        </ul>
      )}
    </div>
  );
};

type UploadStateProps<F extends MediaFolder> = FileState<F> & {
  onRemove: (file: File) => void;
  onRetry: (file: File) => void;
  isRetrying: boolean;
};

export const UploadState = <F extends MediaFolder>({
  file,
  state,
  preview,
  error,
  onRemove,
  onRetry,
  isRetrying,
}: UploadStateProps<F>) => {
  const isImage = file.type.startsWith('image');

  return (
    <li className="flex items-center justify-between rounded-md border border-border px-3 py-2">
      <div className="flex flex-1 min-w-0 gap-2">
        {isImage && (
          <div className="w-12 flex flex-col justify-center items-center aspect-square">
            <Image
              src={preview!}
              blurDataURL={preview!}
              alt={file.name}
              width={40}
              height={40}
              className="h-full w-fit overflow-hidden rounded-lg object-contain bg-contain!"
            />
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col gap-0.5" title={file.name}>
          <span className="text-sm font-medium line-clamp-1">{file.name}</span>
          {state === 'error' ? (
            <span className="text-xs text-destructive capitalize">{error}</span>
          ) : (
            <span
              className={cn('text-x capitalize', {
                'text-sidebar-primary': state === 'uploading',
                'text-green-600': state === 'success',
              })}
            >
              {state}
            </span>
          )}
        </div>
      </div>

      {state === 'error' && (
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          icon={<HugeiconsIcon icon={Refresh01Icon} className="size-4" />}
          onClick={() => onRetry(file)}
          isLoading={isRetrying}
        />
      )}

      {state === 'uploading' && <Button variant="ghost" size="icon-sm" loadingIconClassName="size-5" isLoading />}

      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        icon={<HugeiconsIcon icon={X} className="size-4" />}
        onClick={() => onRemove(file)}
      />
    </li>
  );
};
