'use client';

import type { ComponentProps } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useSearchParams } from '@/hooks';

import { Button } from './Button';

type NextLinkProps = ComponentProps<typeof NextLink>;

export interface LinkProps extends NextLinkProps {
  keepSearchParams?: boolean;
  isDisabled?: boolean;
}

export const Link = ({ keepSearchParams, isDisabled, className, children, ...props }: LinkProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const href = keepSearchParams ? `${props.href}?${searchParams.toString()}` : props.href;
  const isCurrent = props.href === pathname;

  if (isDisabled)
    return (
      <Button
        isDisabled
        variant="ghost"
        className={cn('bg-transparent text-start p-0 min-h-0 h-auto min-w-0 w-auto', className)}
      >
        {children}
      </Button>
    );

  return (
    <NextLink
      className={cn(className)}
      {...props}
      onClick={(e) => {
        if (isCurrent) window.scrollTo({ top: 0, behavior: 'smooth' });

        props.onClick?.(e);
      }}
      href={href}
    >
      {children}
    </NextLink>
  );
};
