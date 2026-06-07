'use client';

import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { useDisclosure } from '@/hooks';

import { Button } from '../Button';
import { TopBarCTA } from '../sidebar';
import { UserCreateModal } from './UserCreateModal';

export const UsersCTA = () => {
  const modalDisclosure = useDisclosure();

  return (
    <TopBarCTA>
      <Button icon={<HugeiconsIcon icon={Plus} />} onClick={modalDisclosure.onOpen}>
        Create User
      </Button>

      <UserCreateModal {...modalDisclosure} />
    </TopBarCTA>
  );
};
