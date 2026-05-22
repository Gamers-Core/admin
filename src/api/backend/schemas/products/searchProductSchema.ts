import z from 'zod';

import { productStatuses, sortProductOptions, stockFilters } from '../../const';

const priceRangeRefinement = (
  { minPrice, maxPrice }: { minPrice?: string; maxPrice?: string },
  ctx: z.RefinementCtx,
) => {
  if (!minPrice || !maxPrice) return;

  if (Number(maxPrice) >= Number(minPrice)) return;

  ctx.addIssue({ code: 'custom', message: 'Max price must be greater than or equal to min price', path: ['maxPrice'] });
};

const refineOptionalStringNumber = (val: string | undefined) =>
  typeof val === 'undefined' || val === '' || (!isNaN(Number(val)) && Number(val) >= 1);

export const filtersProductSchema = z
  .object({
    brandId: z.string().optional().refine(refineOptionalStringNumber, { message: 'Invalid brand ID' }),
    categoryId: z.string().optional().refine(refineOptionalStringNumber, { message: 'Invalid category ID' }),
    minPrice: z.string().optional().refine(refineOptionalStringNumber, { message: 'Invalid price range' }),
    maxPrice: z.string().optional().refine(refineOptionalStringNumber, { message: 'Invalid price range' }),
    stock: z.enum(stockFilters).optional(),
    sort: z.enum(sortProductOptions).optional(),
    status: z.enum(productStatuses).optional(),
  })
  .superRefine(priceRangeRefinement);

export const searchProductSchema = z
  .object({ q: z.string().optional() })
  .extend(filtersProductSchema.shape)
  .superRefine(priceRangeRefinement);

export type SearchProductSchema = z.infer<typeof searchProductSchema>;
export type FiltersProductSchema = z.infer<typeof filtersProductSchema>;
