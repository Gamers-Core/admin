'use client';

import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { useDisclosure } from '@/hooks';

import { Button } from '../Button';
import { CategoryFormModal } from './CategoryFormModal';
import { TopBarCTA } from '../sidebar';

export const CategoriesCTA = () => {
  const modalDisclosure = useDisclosure();

  return (
    <TopBarCTA>
      <Button icon={<HugeiconsIcon icon={Plus} />} onClick={modalDisclosure.onOpen}>
        Add Category
      </Button>

      <CategoryFormModal disclosure={modalDisclosure} />
    </TopBarCTA>
  );
};
