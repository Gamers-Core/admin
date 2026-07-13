import z from 'zod';

import { discountEligibilities, discountMethods, discountTargets, discountSorts } from '../../const';

export const filtersDiscountSchema = z.object({
  method: z.enum(discountMethods).optional(),
  target: z.enum(discountTargets).optional(),
  eligibility: z.enum(discountEligibilities).optional(),
  sort: z.enum(discountSorts).optional(),
});

export const searchDiscountSchema = z.object({ q: z.string().optional() }).extend(filtersDiscountSchema.shape);

export type SearchDiscountSchema = z.infer<typeof searchDiscountSchema>;
export type FiltersDiscountSchema = z.infer<typeof filtersDiscountSchema>;
