'use client';

import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { useDisclosure } from '@/hooks';

import { Button } from '../Button';
import { CategoryFormModal } from './CategoryFormModal';

export const CategoriesCTA = () => {
  const modalDisclosure = useDisclosure();

  return (
    <div>
      <Button icon={<HugeiconsIcon icon={Plus} />} onClick={modalDisclosure.onOpen}>
        Add Category
      </Button>

      <CategoryFormModal disclosure={modalDisclosure} />
    </div>
  );
};
