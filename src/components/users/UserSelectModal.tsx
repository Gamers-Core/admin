'use client';

import { useEffect, useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check } from '@hugeicons/core-free-icons';

import { FullUser } from '@/api';
import { Disclosure, useDebounce, useUsersQuery } from '@/hooks';
import { cn } from '@/lib/utils';

import { Modal, ModalFooter } from '../Modal';
import { Input, Spinner } from '../ui';
import { Button } from '../Button';

interface UserSelectModalProps<M extends 'single' | 'multiple'> extends Disclosure {
  mode: M;
  onUsersSelect?: (variantId: [FullUser] | FullUser[]) => void;
  userIds?: number[];
}

export const UserSelectModal = <M extends 'single' | 'multiple'>({
  mode,
  onUsersSelect,
  userIds,
  ...disclosure
}: UserSelectModalProps<M>) => {
  const isSingleMode = mode === 'single';

  const [search, setSearch] = useState<string>();

  const debouncedSearch = useDebounce(search, 700);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch]);

  const usersQuery = useUsersQuery({ q: debouncedSearch });

  const selectedUsersById = useMemo(
    () => usersQuery.data?.filter((user) => userIds?.includes(user.id)),
    [usersQuery.data, userIds],
  );

  const [selectedUsers, setSelectedUser] = useState<FullUser[]>(selectedUsersById ?? []);

  useEffect(() => {
    if (!usersQuery.data || !userIds) return;

    setSelectedUser(selectedUsersById ?? []);
  }, [userIds, usersQuery.data, selectedUsersById]);

  return (
    <Modal title="Select Users" {...disclosure}>
      <Input
        value={search ?? ''}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for users..."
        className="w-full min-h-10 p-2 px-3 text-sm/relaxed md:text-base/relaxed bg-accent"
      />

      <div className="flex flex-col gap-4 overflow-y-auto">
        {usersQuery.isPending ? (
          <Spinner className="size-8 m-auto" />
        ) : (
          usersQuery.data?.map((user) => {
            const isSelected = selectedUsers.some(({ id }) => id === user.id);

            return (
              <Button
                key={user.id}
                variant="outline"
                className="flex gap-4 border rounded-lg shadow-sm relative p-4 justify-between text-start h-auto hover:opacity-80 transition-opacity duration-300"
                onClick={() => setSelectedUser(isSingleMode ? [user] : [...selectedUsers, user])}
              >
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                  <h3 className="font-medium text-sm truncate min-w-0">{user.name}</h3>

                  <p className="text-muted-foreground text-sm truncate">{user.email}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col justify-between gap-1">
                    <p className="w-fit rounded-full bg-sidebar px-3 py-1 text-xs font-medium text-muted-foreground">
                      {user.addresses.length} addresses
                    </p>

                    <p className="w-fit rounded-full bg-sidebar px-3 py-1 text-xs font-medium text-muted-foreground">
                      {user.ordersCount} orders
                    </p>
                  </div>

                  <div
                    className={cn(
                      'size-6 flex justify-center items-center rounded-full border bg-transparent transition-colors duration-300',
                      { 'border-primary bg-primary': isSelected },
                    )}
                  >
                    <HugeiconsIcon
                      icon={Check}
                      className={cn('text-muted-foreground transition-colors duration-300 invisible', {
                        'text-foreground visible': isSelected,
                      })}
                    />
                  </div>
                </div>
              </Button>
            );
          })
        )}
      </div>

      <ModalFooter>
        <Button
          variant="default"
          className="w-full h-auto py-2 text-lg"
          isDisabled={selectedUsers.length === 0 || (isSingleMode && selectedUsers.length > 1)}
          isLoading={usersQuery.isPending}
          onClick={() => {
            onUsersSelect?.(mode === 'single' ? [selectedUsers[0]] : selectedUsers);

            disclosure.onClose();
          }}
        >
          {userIds && userIds.length > 0 ? 'Update' : 'Add'} User{mode === 'multiple' && 's'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
