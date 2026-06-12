'use client';

import { SearchOrderSchema } from '@/api';
import { useOrdersQuery } from '@/hooks';

import { DataTable } from '../DataTable';
import { orderColumns } from './orderColumns';

interface OrdersListProps {
  searchParams: SearchOrderSchema | undefined;
}

export const OrdersList = ({ searchParams }: OrdersListProps) => {
  const ordersQuery = useOrdersQuery(searchParams);

  return (
    <DataTable
      data={ordersQuery.data ?? []}
      columns={orderColumns}
      placeholder="No orders found."
      getRowHref={({ orderNumber }) => `/orders/${orderNumber}`}
    />
  );
};
