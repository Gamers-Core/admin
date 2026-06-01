import { memo } from 'react';

import { cn } from '@/lib/utils';

interface HTMLRenderProps {
  html: string;
  className?: string;
}

export const HTMLRender = (displayName: string) => {
  const Component = memo(({ html, className, ...props }: HTMLRenderProps) => (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={cn(
        'prose prose-sm md:prose-base dark:prose-invert max-w-none prose-li:leading-normal prose-p:mt-0 prose-p:mb-0 prose-ul:mb-0 prose-ul:mt-0',
        className,
      )}
      {...props}
    />
  ));

  Component.displayName = displayName;

  return Component;
};
