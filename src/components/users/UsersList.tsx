'use client';

import { SearchUsersSchema } from '@/api';
import { useUsersQuery } from '@/hooks';

import { DataTable } from '../DataTable';
import { userColumns } from './userColumns';

interface UsersListProps {
  searchParams: SearchUsersSchema | undefined;
}

export const UsersList = ({ searchParams }: UsersListProps) => {
  const usersQuery = useUsersQuery(searchParams);

  return (
    <DataTable
      data={usersQuery.data ?? []}
      columns={userColumns}
      placeholder="No users found."
      getRowHref={({ id }) => `/users/${id}`}
    />
  );
};
