'use client';

import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { useDisclosure } from '@/hooks';

import { Button } from '../Button';
import { BrandFormModal } from './BrandFormModal';

export const BrandsCTA = () => {
  const modalDisclosure = useDisclosure();

  return (
    <div>
      <Button icon={<HugeiconsIcon icon={Plus} />} onClick={modalDisclosure.onOpen}>
        Add Brand
      </Button>

      <BrandFormModal disclosure={modalDisclosure} />
    </div>
  );
};
