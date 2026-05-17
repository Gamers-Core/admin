/* eslint-disable react-hooks/rules-of-hooks */

import { ColumnDef } from '@tanstack/react-table';

import { defaultLocale, Product, stockFilters } from '@/api';
import { useBrandsQuery, useCategoriesQuery, useFormatCurrency, useFormatDate } from '@/hooks';
import { cn } from '@/lib/utils';

import { Media } from '../Media';
import { StatusBadge } from './StatusBadge';
import { Link } from '../Link';
import { SortHeader } from './SortHeader';
import { FilterHeader } from '../FilterHeader';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'media',
    header: '',
    size: 56,
    cell: ({ row }) => (
      <Media media={row.original.variants[0].image} className="min-w-14 size-14 object-contain rounded-lg" />
    ),
  },
  {
    accessorKey: 'name',
    header: () => <SortHeader label="Product" sortKey="title" />,
    cell: ({ row }) => (
      <Link href={`/products/${row.original.id}`} className="flex flex-col min-w-0">
        <span className="font-medium text-sm truncate">{row.original.name[defaultLocale]}</span>

        <span className="text-xs text-muted-foreground truncate">{row.original.title[defaultLocale]}</span>
      </Link>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'variants',
    header: () => <FilterHeader label="Inventory" filterKey="stock" options={stockFilters} />,
    cell: ({ row }) => {
      const total = row.original.variants.reduce((sum, v) => sum + v.stock, 0);
      const active = row.original.variants.filter((v) => v.isActive).length;

      return (
        <div className="flex flex-col">
          <span className={cn('text-sm', { 'text-green-500': total > 0, 'text-red-500': total === 0 })}>
            {total} in stock
          </span>

          <span className="text-xs text-muted-foreground">
            {active} of {row.original.variants.length} variants
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'variants',
    id: 'price',
    header: () => <SortHeader label="Price" sortKey="price" />,
    cell: ({ row }) => {
      const formatCurrency = useFormatCurrency();

      const prices = row.original.variants.map((v) => v.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);

      return (
        <div className="flex gap-1 text-sm">
          <p>{formatCurrency(min)}</p>

          {min !== max && (
            <>
              <span>-</span>
              <p>{formatCurrency(max)}</p>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: () => {
      const categoriesQuery = useCategoriesQuery();

      return <FilterHeader label="Category" filterKey="categoryId" options={categoriesQuery.data!} />;
    },
    cell: ({ row }) => <span className="text-sm truncate">{row.original.category.name[defaultLocale]}</span>,
  },
  {
    accessorKey: 'brand',
    header: () => {
      const brandsQuery = useBrandsQuery();

      return <FilterHeader label="Brand" filterKey="brandId" options={brandsQuery.data!} />;
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-0">
        <Media
          media={row.original.brand.image}
          alt={row.original.brand.name[defaultLocale]}
          className="size-5 rounded-full"
        />

        <span className="text-sm truncate">{row.original.brand.name[defaultLocale]}</span>
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: () => <SortHeader label="Added" sortKey="created" />,
    cell: ({ row }) => {
      const formatDate = useFormatDate();

      return <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt, 'd/MM/yyyy')}</span>;
    },
  },
];
