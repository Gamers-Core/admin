import { ButtonHTMLAttributes, ComponentProps } from 'react';

import { cn } from '@/lib/utils';

import { Button as ShadCNButton } from './ui/button';
import { Spinner, Tooltip, TooltipContent, TooltipTrigger } from './ui';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  loadingIconClassName?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';
  tooltip?: ComponentProps<typeof TooltipContent> & { tooltip?: string };
}

export const Button = ({
  children,
  isLoading,
  isDisabled,
  className,
  icon,
  loadingIconClassName,
  size,
  tooltip,
  ...props
}: ButtonProps) => {
  if (isLoading)
    return (
      <TooltipWrapper {...tooltip}>
        <ShadCNButton
          className={cn('opacity-80 cursor-not-allowed flex justify-center items-center', className)}
          {...props}
          disabled
        >
          <Spinner className={cn('size-6', loadingIconClassName)} />
        </ShadCNButton>
      </TooltipWrapper>
    );

  return (
    <TooltipWrapper {...tooltip}>
      <ShadCNButton
        size={size}
        type="button"
        className={cn('cursor-pointer', { 'cursor-not-allowed': isDisabled }, className)}
        {...props}
        disabled={isDisabled}
      >
        {icon}

        {children}
      </ShadCNButton>
    </TooltipWrapper>
  );
};

interface TooltipWrapperProps extends ComponentProps<typeof TooltipContent> {
  children: React.ReactNode;
  tooltip?: string;
}

const TooltipWrapper = ({ children, tooltip, ...tooltipContentProps }: TooltipWrapperProps) => {
  if (!tooltip) return children;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>

      <TooltipContent align="center" {...tooltipContentProps}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};
