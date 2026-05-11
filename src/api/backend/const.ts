import type { Locale, MediaFolder, MediaFormat } from './types';

export const authPurposes = ['admin_signin'] as const;

export const defaultLocale = 'en' as const satisfies Locale;
export const locales = ['en', 'ar'] as const;
export const localeDir: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};

export const mediaTypes = ['image', 'video', 'audio', 'raw'] as const;

export const mediaFolders = ['product', 'variant', 'brand', 'userReview'] as const;

export const mediaFoldersTypeMap = {
  product: 'all',
  variant: 'image',
  brand: 'image',
  userReview: 'image',
} as const satisfies Record<MediaFolder, MediaFormat | MediaFormat[]>;

export const mediaRawFormats = ['.pdf', '.csv', '.txt', '.zip', '.doc', '.docx', '.xls', '.xlsx'] as const;
