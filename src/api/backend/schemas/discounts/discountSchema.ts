import z from 'zod';

import {
  discountEligibilities,
  discountMethods,
  discountTargets,
  discountValueTypes,
  paymentMethods,
} from '../../const';
import { Brand, Category, SearchUser, VariantWithProduct } from '../../types';

export const discountSchema = z.object({
  isActive: z.boolean(),
  startsAt: z.iso.datetime().optional(),
  expiresAt: z.iso.datetime().optional(),
  method: z.enum(discountMethods),
  code: z.string().optional(),
  valueType: z.enum(discountValueTypes),
  value: z.number().min(1),
  minOrderAmount: z.number().min(1).optional(),
  maxDiscountAmount: z.number().min(1).optional(),
  usageLimit: z.number().int().min(1).optional(),
  usageLimitPerUser: z.number().int().min(1).optional(),
  target: z.enum(discountTargets),
  variants: z.array(z.custom<VariantWithProduct>()).optional(),
  categories: z.array(z.custom<Category>()).optional(),
  brands: z.array(z.custom<Brand>()).optional(),
  eligibility: z.enum(discountEligibilities),
  eligibleUsers: z.array(z.custom<SearchUser>()).optional(),
  paymentMethods: z.array(z.enum(paymentMethods)).optional(),
});

export type DiscountSchema = z.infer<typeof discountSchema>;
