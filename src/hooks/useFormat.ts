'use client';

import { format, isThisWeek, isToday, isYesterday, type FormatDateOptions } from 'date-fns';
import { enUS } from 'date-fns/locale';

import { formatNumber } from '@/helpers';
import { useCallback } from 'react';

export const useFormatCurrency =
  () =>
  (num: number, currency = 'EGP') =>
    formatNumber(num, { style: 'currency', currency, trailingZeroDisplay: 'stripIfInteger' });

export const useFormatDate = () => (date: Date | number | string, formatStr: string, options?: FormatDateOptions) =>
  format(date, formatStr, { locale: enUS, ...options });

export const useFormatLabeledDate = () => {
  const formatDate = useFormatDate();

  return useCallback(
    (date: Date | number | string) => {
      let label = formatDate(date, 'MMM d');

      if (isToday(date)) label = 'Today';
      if (isYesterday(date)) label = 'Yesterday';
      if (isThisWeek(date, { weekStartsOn: 0 })) label = formatDate(date, 'EEEE');

      const time = formatDate(date, 'h:mm a');

      return `${label} at ${time}`;
    },
    [formatDate],
  );
};
