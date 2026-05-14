'use client';
import { ComponentType, useLayoutEffect } from 'react';
import { useTopBarStore } from '@/stores';

export const useCTA = (Component: ComponentType) => {
  const { setCta, clearCta } = useTopBarStore();

  useLayoutEffect(() => {
    setCta(<Component />);

    return () => clearCta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
