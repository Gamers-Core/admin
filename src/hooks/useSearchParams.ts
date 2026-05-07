'use client';
import { usePathname, useRouter, useSearchParams as useSearchParamsNext } from 'next/navigation';
import { useCallback } from 'react';

type ParamValue = string | number | boolean | null | undefined;
type ParamUpdates = Record<string, ParamValue>;
type NavigationMethod = 'replace' | 'push';

type GetOverload = {
  <T = Record<string, string>>(): Partial<T>;
  (key: string): string | null;
};

const applyParam = (params: URLSearchParams, key: string, value: ParamValue) => {
  if (value === undefined || value === null || value === '') return params.delete(key);
  params.set(key, String(value));
};

export const useSearchParams = () => {
  const searchParams = useSearchParamsNext();
  const pathname = usePathname();
  const router = useRouter();

  const get = useCallback(
    // eslint-disable-next-line react-hooks/use-memo
    ((key?: string) => {
      if (key === undefined) return Object.fromEntries(searchParams.entries());
      return searchParams.get(key);
    }) as GetOverload,
    [searchParams],
  );

  const set = useCallback(
    <T extends object = ParamUpdates>(
      updates: T | string,
      value?: ParamValue,
      method: NavigationMethod = 'replace',
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      if (typeof updates === 'string') applyParam(params, updates, value);
      else Object.entries(updates).forEach(([key, nextValue]) => applyParam(params, key, nextValue));

      const nextQuery = params.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

      if (nextUrl === currentUrl) return;
      router[method](nextUrl, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const toString = useCallback(() => searchParams.toString(), [searchParams]);

  return { get, set, toString };
};
