'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';

import { useDisclosure, useUserQuery } from '@/hooks';

import { TopBarCTA } from '../sidebar';
import { Button } from '../Button';
import { UserEditModal } from './UserEditModal';

interface UserCTAProps {
  userId: number;
}

export const UserCTA = ({ userId }: UserCTAProps) => {
  const modalDisclosure = useDisclosure();
  const userQuery = useUserQuery(userId);

  if (!userQuery.data) return null;

  return (
    <TopBarCTA className="flex-1 gap-2 justify-end">
      <Button icon={<HugeiconsIcon icon={PencilEdit02Icon} />} onClick={modalDisclosure.onOpen}>
        Edit User
      </Button>

      <UserEditModal user={userQuery.data} {...modalDisclosure} />
    </TopBarCTA>
  );
};
