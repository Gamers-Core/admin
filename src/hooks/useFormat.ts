'use client';

import { format, type FormatDateOptions } from 'date-fns';
import { enUS } from 'date-fns/locale';

import { formatNumber } from '@/helpers';

export const useFormatCurrency =
  () =>
  (num: number, currency = 'EGP') =>
    formatNumber(num, { style: 'currency', currency, trailingZeroDisplay: 'stripIfInteger' });

export const useFormatDate = () => (date: Date | number | string, formatStr: string, options?: FormatDateOptions) =>
  format(date, formatStr, { locale: enUS, ...options });
