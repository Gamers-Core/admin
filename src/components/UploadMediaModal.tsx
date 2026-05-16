import { MediaByFolder, MediaFolder } from '@/api';
import { Disclosure } from '@/hooks';
import { useUploadMediaStore } from '@/stores';

import { UploadMedia } from './UploadMedia';
import { Modal } from './Modal';

interface UploadStateProps<F extends MediaFolder> extends Disclosure {
  folder: F;
  onSuccess: (media: MediaByFolder<F>[]) => void;
}

export const UploadMediaModal = <F extends MediaFolder>({ folder, onSuccess, ...disclosure }: UploadStateProps<F>) => {
  const isUploading = useUploadMediaStore((state) => state.files.some(({ state }) => state === 'uploading'));

  const onOpenChange = (open: boolean) => {
    if (isUploading) return;

    disclosure.onOpenChange(open);
  };

  return (
    <Modal title="Add Media" {...disclosure} onOpenChange={onOpenChange}>
      <UploadMedia folder={folder} onSuccess={onSuccess} />
    </Modal>
  );
};
