'use client';

import { ReactElement, useLayoutEffect } from 'react';

import { useTopBarStore } from '@/stores';

export const useCTA = <P>(getElement: () => ReactElement<P>) => {
  const setCta = useTopBarStore((state) => state.setCta);
  const clearCta = useTopBarStore((state) => state.clearCta);

  useLayoutEffect(() => {
    setCta(getElement());

    return () => clearCta();
  }, [getElement, setCta, clearCta]);
};
