/* eslint-disable react-hooks/rules-of-hooks */

import { ColumnDef } from '@tanstack/react-table';

import { SearchUser, sortUserOptions } from '@/api';
import { useFormatLabeledDate } from '@/hooks';

import { Link } from '../Link';
import { SortHeader } from '../SortHeader';

export const userColumns: ColumnDef<SearchUser>[] = [
  {
    accessorKey: 'createdAt',
    size: 160,
    header: () => <SortHeader label="Created" sortKey="created" sortOptions={sortUserOptions} />,
    cell: ({ row }) => {
      const formatLabeledDate = useFormatLabeledDate();

      return <span className="text-sm text-muted-foreground">{formatLabeledDate(row.original.createdAt)}</span>;
    },
  },
  {
    accessorKey: 'name',
    size: 200,
    header: () => <SortHeader label="Name" sortKey="name" sortOptions={sortUserOptions} />,
    cell: ({ row }) => (
      <Link
        href={`/users/${row.original.id}`}
        className="text-sm font-medium hover:text-primary transition-colors block truncate max-w-52"
        title={row.original.name}
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'email',
    size: 220,
    header: () => <SortHeader label="Email" sortKey="email" sortOptions={sortUserOptions} />,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground truncate max-w-64" title={row.original.email}>
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: 'ordersCount',
    size: 110,
    header: () => <SortHeader label="Orders" sortKey="orders" sortOptions={sortUserOptions} />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground tabular-nums">{row.original.ordersCount}</span>,
  },
  {
    accessorKey: 'addresses',
    size: 140,
    header: () => <SortHeader label="Addresses" sortKey="addresses" sortOptions={sortUserOptions} />,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground tabular-nums">{row.original.addresses.length}</span>
    ),
  },
  {
    accessorKey: 'locale',
    size: 120,
    header: () => <SortHeader label="Locale" sortKey="locale" sortOptions={sortUserOptions} />,
    cell: ({ row }) => (
      <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{row.original.locale}</span>
    ),
  },
];
