import z from 'zod';

import { addVariantSchema } from './addVariantSchema';
import { productStatuses } from '../../const';
import { localizedSchema } from '../localizedSchema';

export const addProductSchema = z.object({
  name: localizedSchema,
  title: localizedSchema,
  description: localizedSchema,
  brandId: z.number().min(1),
  categoryId: z.number().int().min(1),
  status: z.enum(productStatuses).optional(),
  mediaIds: z.array(z.number().min(1)).optional(),
  variants: z.array(addVariantSchema).min(1),
});

export type AddProductSchema = z.infer<typeof addProductSchema>;
