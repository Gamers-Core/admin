import z from 'zod';

import { paymentMethods } from '../../const';
import { CrateOrderVariant, FullUser } from '../../types';

export const createOrderSchema = z.object({
  user: z.custom<FullUser>(),
  paymentMethod: z.enum(paymentMethods),
  note: z.string().optional(),
  canOpenPackage: z.boolean().optional(),
  variants: z.array(z.custom<CrateOrderVariant>()).min(1),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
