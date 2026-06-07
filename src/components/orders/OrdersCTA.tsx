'use client';

import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { useDisclosure } from '@/hooks';

import { OrderCreateModal } from '@/components';

import { Button } from '../Button';
import { TopBarCTA } from '../sidebar';

export const OrdersCTA = () => {
  const modalDisclosure = useDisclosure();

  return (
    <TopBarCTA>
      <Button icon={<HugeiconsIcon icon={Plus} />} onClick={modalDisclosure.onOpen}>
        Create Order
      </Button>

      <OrderCreateModal disclosure={modalDisclosure} />
    </TopBarCTA>
  );
};
