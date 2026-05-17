'use client';
import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number = 700): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const serialized =
    typeof value === 'object' && value !== null ? JSON.stringify(value, Object.keys(value).sort()) : value;

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized, delay]);

  return debouncedValue;
};
