import z from 'zod';

import { paymentMethods } from '../../const';
import { CrateOrderVariant, SearchUser } from '../../types';

export const createOrderSchema = z.object({
  user: z.custom<SearchUser>(),
  paymentMethod: z.enum(paymentMethods),
  note: z.string().optional(),
  canOpenPackage: z.boolean().optional(),
  variants: z.array(z.custom<CrateOrderVariant>()).min(1),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
