import { create } from 'zustand';

import { MediaByFolder, MediaFolder } from '@/api';

export type FileState<F extends MediaFolder = MediaFolder> =
  | { state: 'idle'; file: File; preview: string | null; media: null; error: null; abort: null }
  | { state: 'uploading'; file: File; preview: string | null; media: null; error: null; abort: AbortController }
  | { state: 'error'; file: File; preview: string | null; media: null; error: string; abort: null }
  | { state: 'success'; file: File; preview: string | null; media: MediaByFolder<F>; error: null; abort: null };

type State<F extends MediaFolder = MediaFolder> = {
  folder: F | null;
  files: FileState<F>[];
};

interface Action<F extends MediaFolder = MediaFolder> {
  addFiles: (files: File[]) => void;
  removeFile: (file: File) => void;
  setUploading: (file: File) => void;
  setSuccess: (file: File, media: MediaByFolder<F>) => void;
  setError: (file: File, error: string) => void;
  getFileState: (file: File) => FileState<F> | undefined;
  reset: () => void;
}

type UploadMediaStore<F extends MediaFolder = MediaFolder> = State<F> & Action<F>;

const initialState: State = {
  folder: null,
  files: [],
};

export const useUploadMediaStore = create<UploadMediaStore>((set, get) => ({
  ...initialState,

  addFiles: (files) =>
    set((state) => ({
      files: [
        ...state.files,
        ...files.map((file) => ({
          state: 'idle' as const,
          file,
          preview: file.type.startsWith('image') ? URL.createObjectURL(file) : null,
          media: null,
          error: null,
          abort: null,
        })),
      ],
    })),

  removeFile: (file) =>
    set((state) => {
      const entry = state.files.find((f) => f.file === file);
      if (entry?.preview) URL.revokeObjectURL(entry.preview);

      return { files: state.files.filter((f) => f.file !== file) };
    }),

  setUploading: (file) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.file === file
          ? {
              state: 'uploading' as const,
              file: f.file,
              preview: f.preview,
              media: null,
              error: null,
              abort: new AbortController(),
            }
          : f,
      ),
    })),

  setSuccess: (file, media) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.file === file
          ? { state: 'success' as const, file: f.file, preview: f.preview, media, error: null, abort: null }
          : f,
      ),
    })),

  setError: (file, error) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.file === file
          ? { state: 'error' as const, file: f.file, preview: f.preview, media: null, error, abort: null }
          : f,
      ),
    })),

  getFileState: (file) => get().files.find((f) => f.file === file),

  reset: () => {
    get().files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));

    set(initialState);
  },
}));
