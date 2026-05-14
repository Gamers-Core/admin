import z from 'zod';

import { localizedSchema } from '../localizedSchema';

export const addVariantSchema = z.object({
  name: localizedSchema,
  isActive: z.boolean().optional(),
  stock: z.number().int().min(0),
  price: z.number().int().min(0),
  imageId: z.number().int().min(1),
  costPerItem: z.number().int().min(0),
  compareAt: z.number().int().min(0).optional(),
});

export type AddVariantSchema = z.infer<typeof addVariantSchema>;
