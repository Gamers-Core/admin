import { memo } from 'react';

interface HTMLRenderProps {
  html: string;
  className?: string;
}

export const HTMLRender = (displayName: string) => {
  const Component = memo(({ html, ...props }: HTMLRenderProps) => (
    <div dangerouslySetInnerHTML={{ __html: html }} {...props} />
  ));

  Component.displayName = displayName;

  return Component;
};
