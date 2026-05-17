'use client';

import { useSearchParams } from '@/hooks';
import { ProductStatus, productStatuses } from '@/api';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui';

interface StatusFilterProps {
  value?: ProductStatus;
}

export const StatusFilter = ({ value }: StatusFilterProps) => {
  const { set, get } = useSearchParams();

  const onSelect = (value: string) => {
    if (value === 'all') return set('status', undefined, 'replace');

    set('status', value as ProductStatus, 'replace');
  };

  const currentStatus = get('status') ?? value;

  return (
    <Select value={currentStatus ?? 'all'} onValueChange={onSelect}>
      <SelectTrigger className="min-w-24 h-10! max-h-max text-sm capitalize">
        <SelectValue placeholder={value} />
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectGroup>
          <SelectItem value="all" className="capitalize text-sm">
            all
          </SelectItem>

          {productStatuses.map((status) => (
            <SelectItem key={status} value={status} className="capitalize text-sm">
              {status}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
