import {
  authPurposes,
  locales,
  mediaFolders,
  mediaFoldersTypeMap,
  mediaTypes,
  policyTypes,
  productStatuses,
  sortProductOptions,
  stockFilters,
} from './const';
import type { Localized } from './schemas';

interface ValidationError<P extends string = string> {
  property: P;
  keys: string[];
  messages: string[];
  children: ValidationError<P>[];
}

export type ValidationErrors<K extends string = string> = {
  errors: ValidationError<K>[];
};

export interface AppError {
  message: string;
}

export type BackendError<E extends ValidationErrors | AppError = ValidationErrors | AppError> = {
  status: number;
} & E;

export interface OTPFlowResponse {
  sessionId: string;
}

export interface OtpVerifyResultMap {
  admin_signin: {
    user: BasicUser;
  };
}

export type AuthPurpose = (typeof authPurposes)[number];

export type VerifyOTPResponse = {
  [P in AuthPurpose]: { purpose: P } & OtpVerifyResultMap[P];
};

export interface BasicUser {
  id: number;
  name: string;
  email: string;
}

export type Locale = (typeof locales)[number];

export type MediaType = (typeof mediaTypes)[number];
export type MediaFormat = 'all' | MediaType;
export type MediaFolder = (typeof mediaFolders)[number];

export type MediaTypeByFolder<
  F extends MediaFolder,
  T extends (typeof mediaFoldersTypeMap)[F] = (typeof mediaFoldersTypeMap)[F],
> = T extends 'all' ? MediaType : T;

export type MediaByFolder<F extends MediaFolder> = Media<MediaTypeByFolder<F>>;
export interface Media<T extends MediaType = MediaType> {
  id: number;
  src: string;
  blurDataURL: T extends 'image' ? string | null : null;
  type: T;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface Brand {
  id: number;
  name: Localized;
  image: Media<'image'> | null;
}

export interface Category {
  id: number;
  name: Localized;
}

export interface FAQ {
  id: number;
  question: Localized;
  answer: Localized;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserReview {
  id: number;
  position: number;
  facebookURL: string;
  image: Media<'image'> | null;
}

export type PolicyType = (typeof policyTypes)[number];

export interface Policy {
  id: number;
  type: PolicyType;
  value: Localized;
  version: number;
  updatedAt: string;
}

export type Policies = Record<PolicyType, Policy>;

export interface ProductMedia extends Media {
  id: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  id: number;
  externalId: string;
  name: Localized;
  isActive: boolean;
  stock: number;
  price: number;
  costPerItem: number;
  compareAt: number | null;
  position: number;
  image: Media<'image'>;
}

export type ProductStatus = (typeof productStatuses)[number];

export interface Product {
  id: number;
  name: Localized;
  title: Localized;
  description: Localized;
  status: ProductStatus;
  variants: Variant[];
  media: ProductMedia[];
  brand: Brand;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export type StockFilter = (typeof stockFilters)[number];
export type SortOption = (typeof sortProductOptions)[number];

type ExtractSortKey<T extends string> = T extends `${infer Key}-ascending` | `${infer Key}-descending` ? Key : never;

export type SortKey = ExtractSortKey<SortOption>;

export interface VariantWithProduct extends Variant {
  product: Product;
}

export interface FeaturedVariant {
  id: number;
  position: number;
  title: Localized;
  variant: VariantWithProduct;
}
