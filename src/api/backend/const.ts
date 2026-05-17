import type { Locale, MediaFolder, MediaFormat, PolicyType } from './types';

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

export const policyTypes = ['terms-of-service', 'shipping', 'refund', 'privacy'] as const;
export const policyTypeLabels: Record<PolicyType, string> = {
  'terms-of-service': 'Terms of Service',
  shipping: 'Shipping Policy',
  refund: 'Refund Policy',
  privacy: 'Privacy Policy',
};

export const productStatuses = ['active', 'draft', 'unlisted'] as const;

export const stockFilters = ['in-stock', 'out-of-stock'] as const;

export const sortOptions = [
  'created-descending',
  'created-ascending',
  'title-ascending',
  'title-descending',
  'price-ascending',
  'price-descending',
] as const;
