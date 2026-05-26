'use client';

import { useCallback, useState } from 'react';

interface DisclosureOptions {
  defaultIsOpen?: boolean;
  canClose?: boolean;
}

export const useDisclosure = ({ defaultIsOpen = false, canClose = true }: DisclosureOptions = {}) => {
  const [open, setOpen] = useState(defaultIsOpen);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!canClose) return;

      setOpen(open);
    },
    [canClose],
  );

  return {
    open,
    onOpenChange,
    onOpen: useCallback(() => onOpenChange(true), [onOpenChange]),
    onClose: useCallback(() => onOpenChange(false), [onOpenChange]),
    onToggle: useCallback(() => onOpenChange(!open), [onOpenChange, open]),
  };
};

export type Disclosure = ReturnType<typeof useDisclosure>;
