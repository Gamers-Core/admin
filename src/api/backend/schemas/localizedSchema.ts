import z from 'zod';

import { defaultLocale, locales } from '../const';
import { Locale } from '../types';

const optionalSchema = locales.reduce(
  (acc, locale) => {
    acc[locale] = z.string().optional();
    return acc;
  },
  {} as Record<Locale, z.ZodOptional<z.ZodString>>,
);

export const localizedSchema = z.object({
  ...optionalSchema,
  [defaultLocale]: z.string().min(1, { message: `${defaultLocale} value is required` }),
});
export const optionalLocalizedSchema = z.object(optionalSchema);

export type Localized = z.infer<typeof localizedSchema>;

export const defaultLocalizedValue = locales.reduce<Localized>((acc, locale) => ({ ...acc, [locale]: '' }), {
  [defaultLocale]: '',
});
