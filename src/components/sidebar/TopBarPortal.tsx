'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

const TopBarPortalContext = createContext<HTMLElement | null>(null);

export const useTopBarPortal = () => useContext(TopBarPortalContext);

export const TopBarPortalProvider = TopBarPortalContext.Provider;

interface TopBarPortalProps {
  children: ReactNode;
}

export const TopBarPortal = ({ children }: TopBarPortalProps) => {
  const portalEl = useTopBarPortal();

  if (!portalEl) return null;

  return createPortal(children, portalEl);
};
