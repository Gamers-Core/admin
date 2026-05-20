'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import { TopBar } from './TopBar';
import { TopBarPortalProvider } from './TopBarPortal';

interface TopBarPortalLayoutProps {
  pathname: string | null;
  children: ReactNode;
}

export const TopBarPortalLayout = ({ pathname, children }: TopBarPortalLayoutProps) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  return (
    <>
      <TopBar pathname={pathname} onPortalReady={setPortalElement} />

      <TopBarPortalProvider value={portalElement}>{children}</TopBarPortalProvider>
    </>
  );
};
