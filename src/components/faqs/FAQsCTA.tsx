'use client';

import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { useDisclosure } from '@/hooks';

import { Button } from '../Button';
import { FAQFormModal } from './FAQFormModal';

export const FAQsCTA = () => {
  const modalDisclosure = useDisclosure();

  return (
    <div>
      <Button icon={<HugeiconsIcon icon={Plus} />} onClick={modalDisclosure.onOpen}>
        Add FAQ
      </Button>

      <FAQFormModal disclosure={modalDisclosure} />
    </div>
  );
};
