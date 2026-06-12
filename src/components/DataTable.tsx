'use client';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  placeholder?: React.ReactNode;
  className?: string;
  getRowHref?: (row: TData) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  placeholder,
  className,
  getRowHref,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  const hasRows = !!table.getRowModel().rows?.length;

  return (
    <div className={cn('relative w-full flex flex-col overflow-x-auto rounded-md border flex-1', className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.column.getSize() !== 150 ? header.column.getSize() : undefined }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {hasRows && (
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              const href = getRowHref?.(row.original);
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={href ? 'cursor-pointer' : undefined}
                  onClick={
                    href
                      ? (e) => {
                          if ((e.target as HTMLElement).closest('a, button, input, [role="button"]')) return;

                          router.push(href);
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
      {!hasRows && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-base">
          {placeholder || 'No Results Found.'}
        </div>
      )}
    </div>
  );
}
