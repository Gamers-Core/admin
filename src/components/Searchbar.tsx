'use client';

import { useEffect, useState } from 'react';

import { useDebounce, useSearchParams } from '@/hooks';

import { Input } from './ui';

interface SearchOptionsProps {
  q?: string;
}
export const Searchbar = ({ q }: SearchOptionsProps) => {
  const [search, setSearch] = useState(q || '');

  const { set } = useSearchParams();
  const debouncedSearch = useDebounce(search, 700);

  useEffect(() => {
    set('q', debouncedSearch, 'replace');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <Input
      value={search ?? ''}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search for a titles, names, descriptions, etc."
      className="w-full min-h-10 p-2 px-3 text-sm/relaxed md:text-base/relaxed bg-accent"
    />
  );
};
