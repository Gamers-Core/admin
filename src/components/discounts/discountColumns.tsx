/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table';

import { Discount, discountEligibilities, discountMethods, discountSorts, discountTargets } from '@/api';
import { useFormatCurrency, useFormatDate } from '@/hooks';
import { cn } from '@/lib/utils';

import { FilterHeader } from '../FilterHeader';
import { Link } from '../Link';
import { SortHeader } from '../SortHeader';
import { StatusBadge } from '../StatusBadge';

export const discountColumns: ColumnDef<Discount>[] = [
  {
    accessorKey: 'code',
    size: 160,
    header: 'Code',
    cell: ({ row }) => {
      const code = row.original.code ? row.original.code.toUpperCase() : '—';

      return (
        <Link
          href={`/discounts/${row.original.id}`}
          className="font-mono text-sm font-medium hover:text-primary transition-colors block truncate max-w-40"
          title={code}
        >
          {code}
        </Link>
      );
    },
  },
  {
    accessorKey: 'method',
    size: 130,
    header: () => (
      <FilterHeader
        label="Method"
        filterKey="method"
        options={discountMethods}
        formatter={(value) => value.replaceAll('_', ' ')}
      />
    ),
    cell: ({ row }) => (
      <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
        {row.original.method.replaceAll('_', ' ')}
      </span>
    ),
  },
  {
    accessorKey: 'target',
    size: 100,
    header: () => (
      <FilterHeader
        label="Target"
        filterKey="target"
        options={discountTargets}
        formatter={(value) => value.replaceAll('_', ' ')}
      />
    ),
    cell: ({ row }) => (
      <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
        {row.original.target.replace('_', ' ')}
      </span>
    ),
  },
  {
    accessorKey: 'value',
    size: 120,
    header: () => <span className="font-semibold">Value</span>,
    cell: ({ row }) => {
      const formatCurrency = useFormatCurrency();

      if (row.original.target === 'free_shipping') return <span className="text-sm font-medium">-</span>;

      if (row.original.valueType === 'percentage')
        return <span className="text-sm font-semibold tabular-nums">{row.original.value}%</span>;

      return <span className="text-sm font-semibold tabular-nums">{formatCurrency(row.original.value!)}</span>;
    },
  },
  {
    accessorKey: 'usageCount',
    size: 120,
    header: () => <SortHeader label="Usage" sortKey="usage" sortOptions={discountSorts} />,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground tabular-nums">
        {row.original.usageCount}
        {row.original.usageLimit != null ? ` / ${row.original.usageLimit}` : ''}
      </span>
    ),
  },
  {
    accessorKey: 'eligibility',
    size: 140,
    header: () => (
      <FilterHeader
        label="Eligibility"
        filterKey="eligibility"
        options={discountEligibilities}
        formatter={(value) => value.replaceAll('_', ' ')}
      />
    ),
    cell: ({ row }) => (
      <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
        {row.original.eligibility.replace('_', ' ')}
      </span>
    ),
  },
  {
    accessorKey: 'isActive',
    size: 110,
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.isActive ? 'active' : 'inactive'} />,
  },
  {
    accessorKey: 'expiresAt',
    size: 140,
    header: () => <SortHeader label="Expires" sortKey="expires" sortOptions={discountSorts} />,
    cell: ({ row }) => {
      const formatDate = useFormatDate();
      if (!row.original.expiresAt) return <span className="text-sm text-muted-foreground">—</span>;

      const isExpired = new Date(row.original.expiresAt) < new Date();

      return (
        <span className={cn('text-sm', { 'text-red-500': isExpired, 'text-muted-foreground': !isExpired })}>
          {formatDate(row.original.expiresAt, 'd/MM/yyyy')}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    size: 140,
    header: () => <SortHeader label="Created" sortKey="created" sortOptions={discountSorts} />,
    cell: ({ row }) => {
      const formatDate = useFormatDate();

      return <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt, 'd/MM/yyyy')}</span>;
    },
  },
];
