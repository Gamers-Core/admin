import { useSearchParams } from '@/hooks';
import { defaultLocale, Localized } from '@/api';
import { cn } from '@/lib/utils';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from './ui';

interface FilterHeaderProps<T extends string> {
  label: string;
  filterKey: T;
  options?: readonly string[] | { id: number; name: Localized }[];
}

export const FilterHeader = <T extends string>({ label, filterKey, options }: FilterHeaderProps<T>) => {
  const { get, set } = useSearchParams();

  const currentStatus = get(filterKey) ?? undefined;

  const onSelect = (value: string) => {
    if (value === 'all') return set(filterKey, undefined, 'replace');

    set(filterKey, value, 'replace');
  };

  return (
    <Select value={currentStatus ?? 'all'} onValueChange={onSelect}>
      <SelectTrigger
        className={cn('text-xs capitalize bg-transparent! border-0!', { 'text-sidebar-primary': currentStatus })}
      >
        {label}
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectGroup>
          <SelectItem value="all" className="capitalize text-sm">
            All
          </SelectItem>

          {options?.map((option) => {
            const isObject = typeof option === 'object';
            const optionValue = isObject ? option.id : option;

            return (
              option && (
                <SelectItem key={optionValue} value={String(optionValue)} className="capitalize text-sm">
                  {isObject ? option.name[defaultLocale] : option}
                </SelectItem>
              )
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
