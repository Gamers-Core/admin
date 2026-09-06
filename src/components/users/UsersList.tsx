'use client';

import { SearchUsersSchema } from '@/api';
import { useUsersInfiniteQuery } from '@/hooks';

import { DataTable } from '../DataTable';
import { userColumns } from './userColumns';

interface UsersListProps {
  searchParams: SearchUsersSchema | undefined;
}

export const UsersList = ({ searchParams }: UsersListProps) => {
  const usersQuery = useUsersInfiniteQuery(searchParams);

  const users = usersQuery.data?.pages.flatMap(({ data }) => data) ?? [];

  return (
    <DataTable
      data={users}
      columns={userColumns}
      placeholder="No users found."
      getRowHref={({ id }) => `/users/${id}`}
      onLoadMore={usersQuery.fetchNextPage}
      hasMore={usersQuery.hasNextPage}
      isLoadingMore={usersQuery.isFetchingNextPage}
    />
  );
};
