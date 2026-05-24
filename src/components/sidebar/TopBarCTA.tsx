'use client';

import type { ReactNode } from 'react';

import { TopBarPortal } from './TopBarPortal';

interface TopBarCTAProps {
  children: ReactNode;
}

export const TopBarCTA = ({ children }: TopBarCTAProps) => <TopBarPortal>{children}</TopBarPortal>;
