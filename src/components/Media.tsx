import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';
import { AudioBook01Icon, File01Icon } from '@hugeicons/core-free-icons';

import { type Media as MediaFile, MediaType } from '@/api';
import { cn } from '@/lib/utils';

import { Image } from './Image';

interface MediaProps<T extends MediaType> {
  media: MediaFile<T>;
  alt?: string;
  className?: string;
}

export const Media = <T extends MediaType>({ media, alt, className }: MediaProps<T>) => {
  switch (media.type) {
    case 'image':
      return <Image image={media as MediaFile<'image'>} alt={alt} className={className} />;
    case 'video':
      return <video src={media.src} className={className} />;
    case 'audio':
      return <MediaPlaceholder className={className} icon={AudioBook01Icon} />;
    case 'raw':
      return <MediaPlaceholder className={className} icon={File01Icon} />;
    default:
      return null;
  }
};

interface MediaPlaceholderProps {
  icon: IconSvgElement;
  className?: string;
}

const MediaPlaceholder = ({ icon, className }: MediaPlaceholderProps) => (
  <div className={cn('flex items-center justify-center bg-muted rounded-md', className)}>
    <HugeiconsIcon icon={icon} className="size-8 text-muted-foreground" />
  </div>
);
