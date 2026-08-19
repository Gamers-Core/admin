import {
  authPurposes,
  discountEligibilities,
  discountMethods,
  discountSorts,
  discountTargets,
  discountValueTypes,
  locales,
  mediaFolders,
  mediaFoldersTypeMap,
  mediaTypes,
  orderStatuses,
  paymentMethods,
  paymentStatuses,
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

export type Locale = (typeof locales)[number];

export interface BasicUser {
  id: number;
  name: string;
  email: string;
  locale: Locale;
}

export interface FullUser extends BasicUser {
  orders: Omit<Order, 'user' | 'history'>[];
  addresses: Address[];
  createdAt: string;
}

export interface SearchUser extends BasicUser {
  ordersCount: number;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: number;
  phoneNumber: string;
  secondaryPhoneNumber: string | null;
  detailedAddress: string;
  districtId: string;
  districtName: string;
  cityId: string;
  cityName: string;
  cityDropOff: string;
  nameAr: string;
  isDefault: boolean;
  isWorkAddress: boolean;
}

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

export interface VariantWithProduct extends Variant {
  product: Product;
}

export interface CrateOrderVariant extends VariantWithProduct {
  quantity: number;
}

export interface FeaturedVariant {
  id: number;
  position: number;
  title: Localized;
  variant: VariantWithProduct;
}

export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type PaymentMethod = (typeof paymentMethods)[number];

export interface OrderItem {
  id: number;
  productId: number;
  productTitle: Localized;
  variantExternalId: string;
  variantName: Localized | null;
  imageURL: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderAddress {
  id: number;
  nameAr: string;
  phoneNumber: string;
  secondaryPhoneNumber: string | null;
  detailedAddress: string;
  districtName: string;
  cityName: string;
  isWorkAddress: boolean;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  createdAt: string;
}

export interface OrderAllowedActions {
  statuses: OrderStatus[];
  paymentStatuses: PaymentStatus[];
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  canOpenPackage: boolean;
  note: string | null;
  trackingNumber: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  discountCode: string | null;
  discountAmount: number | null;
  isFreeShipping: boolean;
  codFee: number | null;
  openPackageFee: number | null;
  restocked: boolean;
  history: OrderStatusHistory[];
  allowedActions: OrderAllowedActions;
  user: BasicUser;
}

export interface AppSettings {
  maintenanceMode: {
    enabled: boolean;
    message: Localized;
    disableOnCountdownEnd?: boolean;
    countdown?: string;
  };
  announcement: {
    enabled: boolean;
    message: Localized;
    mediaIds: number[];
    intervalHours: number;
    media?: Media<'image' | 'video'>[];
    disableAt?: string | null;
  };
}

export type AppSettingsKey = keyof AppSettings;

export type DiscountTarget = (typeof discountTargets)[number];

export type DiscountMethod = (typeof discountMethods)[number];

export type DiscountValueType = (typeof discountValueTypes)[number];

export type DiscountEligibility = (typeof discountEligibilities)[number];

export type DiscountSort = (typeof discountSorts)[number];

export interface Discount {
  id: number;
  code: string | null;
  method: DiscountMethod;
  target: DiscountTarget;
  valueType: DiscountValueType | null;
  value: number | null;
  eligibility: DiscountEligibility;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  usageLimitPerUser: number | null;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  variants: VariantWithProduct[];
  categories: Category[];
  brands: Brand[];
  eligibleUsers: SearchUser[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscountUsage {
  id: number;
  discountAmount: number | null;
  user: BasicUser;
  order: {
    orderNumber: string;
    total: number;
    createdAt: string;
  };
  createdAt: string;
}
