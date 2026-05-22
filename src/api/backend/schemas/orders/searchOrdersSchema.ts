import z from 'zod';

import { orderStatuses, paymentMethods, paymentStatuses, sortOrderOptions } from '../../const';

export const filtersOrderSchema = z.object({
  status: z.enum(orderStatuses).optional(),
  paymentStatus: z.enum(paymentStatuses).optional(),
  paymentMethod: z.enum(paymentMethods).optional(),
  sort: z.enum(sortOrderOptions).optional(),
});

export const searchOrderSchema = z.object({ q: z.string().optional() }).extend(filtersOrderSchema.shape);

export type SearchOrderSchema = z.infer<typeof searchOrderSchema>;
export type FiltersOrderSchema = z.infer<typeof filtersOrderSchema>;
