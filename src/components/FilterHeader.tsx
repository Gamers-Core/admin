import { useSearchParams } from '@/hooks';
import { defaultLocale, Localized } from '@/api';
import { cn } from '@/lib/utils';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from './ui';

type FilterOption = string | { id: number; name: Localized };

interface FilterHeaderProps<T extends readonly FilterOption[]> {
  label: string;
  options: T;
  filterKey: string;
}

export const FilterHeader = <T extends readonly FilterOption[]>({
  label,
  filterKey,
  options,
}: FilterHeaderProps<T>) => {
  const { get, set } = useSearchParams();
  const currentValue = get(filterKey) ?? undefined;

  const onSelect = (value: string) => {
    if (value === 'all') return set(filterKey, undefined, 'replace');
    set(filterKey, value, 'replace');
  };

  return (
    <Select value={currentValue ?? 'all'} onValueChange={onSelect}>
      <SelectTrigger
        className={cn('text-xs capitalize bg-transparent! border-0!', {
          'text-sidebar-primary': currentValue,
        })}
      >
        {label}
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectGroup>
          <SelectItem value="all" className="capitalize text-sm">
            All
          </SelectItem>

          {options.map((option) => {
            const isObject = typeof option === 'object';
            const optionValue = isObject ? option.id : option;
            const optionLabel = isObject ? option.name[defaultLocale] : option;

            return (
              <SelectItem key={optionValue} value={String(optionValue)} className="capitalize text-sm">
                {optionLabel}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
