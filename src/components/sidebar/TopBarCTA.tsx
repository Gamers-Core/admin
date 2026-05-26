'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { TopBarPortal } from './TopBarPortal';

interface TopBarCTAProps {
  children: ReactNode;
  className?: string;
}

export const TopBarCTA = ({ children, className }: TopBarCTAProps) => (
  <TopBarPortal>
    <div className={cn('flex items-center gap-1', className)}>{children}</div>
  </TopBarPortal>
);
