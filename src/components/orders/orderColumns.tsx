/* eslint-disable react-hooks/rules-of-hooks */

import { ColumnDef } from '@tanstack/react-table';
import { Order, orderStatuses, paymentStatuses, paymentMethods, sortOrderOptions } from '@/api';
import { useFormatCurrency, useFormatLabeledDate } from '@/hooks';

import { Link } from '../Link';
import { SortHeader } from '../SortHeader';
import { FilterHeader } from '../FilterHeader';
import { OrderStatusBadge } from './OrderStatusBadge';

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderNumber',
    size: 180,
    header: () => <span className="font-semibold">Order</span>,
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.orderNumber}`}
        className="font-mono text-sm font-medium hover:text-primary transition-colors block truncate max-w-45"
        title={`#${row.original.orderNumber}`}
      >
        #{row.original.orderNumber}
      </Link>
    ),
  },
  {
    accessorKey: 'createdAt',
    size: 160,
    header: () => <SortHeader label="Date" sortKey="created" sortOptions={sortOrderOptions} />,
    cell: ({ row }) => {
      const formatLabeledDate = useFormatLabeledDate();

      return (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {formatLabeledDate(row.original.createdAt)}
        </span>
      );
    },
  },
  {
    accessorKey: 'user',
    size: 180,
    header: () => <span className="font-semibold">Customer</span>,
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5 max-w-45">
        <span className="text-sm font-medium truncate" title={row.original.user.name}>
          {row.original.user.name}
        </span>

        <span className="text-xs text-muted-foreground truncate" title={row.original.user.email}>
          {row.original.user.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'items',
    size: 80,
    header: () => <span className="font-semibold">Items</span>,
    cell: ({ row }) => <span className="text-sm text-muted-foreground tabular-nums">{row.original.items.length}</span>,
  },
  {
    accessorKey: 'total',
    size: 130,
    header: () => <SortHeader label="Total" sortKey="total" sortOptions={sortOrderOptions} />,
    cell: ({ row }) => {
      const formatCurrency = useFormatCurrency();
      const formatted = formatCurrency(row.original.total, row.original.currency);

      return (
        <span className="text-sm font-semibold tabular-nums block truncate max-w-32.5" title={formatted}>
          {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: 'paymentMethod',
    size: 140,
    header: () => <FilterHeader label="Payment" filterKey="paymentMethod" options={paymentMethods} />,
    cell: ({ row }) => (
      <span
        className="text-xs uppercase tracking-wide text-muted-foreground font-medium block truncate max-w-35"
        title={row.original.paymentMethod}
      >
        {row.original.paymentMethod}
      </span>
    ),
  },
  {
    accessorKey: 'paymentStatus',
    size: 140,
    header: () => <FilterHeader label="Payment Status" filterKey="paymentStatus" options={paymentStatuses} />,
    cell: ({ row }) => (
      <div className="max-w-35">
        <OrderStatusBadge status={row.original.paymentStatus} />
      </div>
    ),
  },
  {
    accessorKey: 'status',
    size: 140,
    header: () => <FilterHeader label="Order Status" filterKey="status" options={orderStatuses} />,
    cell: ({ row }) => (
      <div className="max-w-35">
        <OrderStatusBadge status={row.original.status} />
      </div>
    ),
  },
];
