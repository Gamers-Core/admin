'use client';

import { SearchOrderSchema } from '@/api';
import { useOrdersInfiniteQuery } from '@/hooks';

import { DataTable } from '../DataTable';
import { orderColumns } from './orderColumns';

interface OrdersListProps {
  searchParams: SearchOrderSchema | undefined;
}

export const OrdersList = ({ searchParams }: OrdersListProps) => {
  const ordersQuery = useOrdersInfiniteQuery(searchParams);

  const orders = ordersQuery.data?.pages.flatMap(({ data }) => data) ?? [];

  return (
    <DataTable
      data={orders}
      columns={orderColumns}
      placeholder="No orders found."
      getRowHref={({ orderNumber }) => `/orders/${orderNumber}`}
      onLoadMore={ordersQuery.fetchNextPage}
      hasMore={ordersQuery.hasNextPage}
      isLoadingMore={ordersQuery.isFetchingNextPage}
    />
  );
};
