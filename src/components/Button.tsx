import { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

import { Button as ShadCNButton } from './ui/button';
import { Spinner } from './ui';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  loadingIconClassName?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';
}

export const Button = ({
  children,
  isLoading,
  isDisabled,
  className,
  icon,
  loadingIconClassName,
  size,
  ...props
}: ButtonProps) => {
  if (isLoading)
    return (
      <ShadCNButton
        className={cn('opacity-80 cursor-not-allowed flex justify-center items-center', className)}
        disabled
        {...props}
      >
        <Spinner className={cn('size-7.5', loadingIconClassName)} />
      </ShadCNButton>
    );

  return (
    <ShadCNButton
      size={size}
      disabled={isDisabled}
      type="button"
      className={cn('cursor-pointer', { 'cursor-not-allowed': isDisabled }, className)}
      {...props}
    >
      {icon}

      {children}
    </ShadCNButton>
  );
};
