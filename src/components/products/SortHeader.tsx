import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDownIcon } from '@hugeicons/core-free-icons';

import { useSearchParams } from '@/hooks';
import { SortKey } from '@/api';

import { Button } from '../Button';

interface SortHeaderProps<T> {
  label: string;
  sortKey: T;
}

export const SortHeader = <T extends SortKey>({ label, sortKey }: SortHeaderProps<T>) => {
  const { get, set } = useSearchParams();

  const current = get('sort');
  const isAsc = current === `${sortKey}-ascending`;
  const isDesc = current === `${sortKey}-descending`;

  const toggle = () => {
    if (!isAsc && !isDesc) return set('sort', `${sortKey}-ascending`);

    if (isAsc) return set('sort', `${sortKey}-descending`);

    set('sort', undefined);
  };

  return (
    <Button variant="ghost" size="sm" className="gap-1 px-2 py-1 font-medium" onClick={toggle}>
      {label}

      {!isAsc && !isDesc && <HugeiconsIcon icon={ArrowUpDownIcon} className="size-3" />}

      {isAsc && <HugeiconsIcon icon={ArrowUp01Icon} className="size-3" />}

      {isDesc && <HugeiconsIcon icon={ArrowDown01Icon} className="size-3" />}
    </Button>
  );
};
