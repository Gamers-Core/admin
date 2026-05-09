'use client';

import NextImage from 'next/image';
import { useState } from 'react';

import { Media } from '@/api';
import { cn } from '@/lib/utils';

type NextImageProps = React.ComponentProps<typeof NextImage>;

type BaseProps = Omit<NextImageProps, 'src' | 'width' | 'height' | 'alt'> & {
  alt?: string;
};

interface SrcProps {
  src: string | null;
  width: number;
  height: number;
}

interface MediaProps {
  image: Media<'image'> | null;
}

type ImageProps = BaseProps & XOR<SrcProps, MediaProps>;

export const Image = (props: ImageProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const isSrc = 'src' in props;
  const isFill = 'fill' in props && props.fill;

  const src = (isSrc ? props.src : props.image?.src) ?? '/assets/placeholder.svg';
  const blurDataURL = !isSrc && props.image?.blurDataURL ? props.image?.blurDataURL : undefined;

  return (
    <NextImage
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      {...props}
      src={src}
      alt={props.alt ?? ''}
      width={isFill ? undefined : ((isSrc ? props.width : props.image?.width) ?? 600)}
      height={isFill ? undefined : ((isSrc ? props.height : props.image?.height) ?? 400)}
      className={cn('duration-500 ease-in-out blur-[0px]', { 'blur-sm': isImageLoading }, props.className)}
      onLoad={() => setIsImageLoading(false)}
    />
  );
};
