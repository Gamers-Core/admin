import z from 'zod';

import { localizedSchema } from '../localizedSchema';
import { MediaByFolder } from '../../types';

export const addVariantSchema = z.object({
  name: localizedSchema,
  isActive: z.boolean().optional(),
  stock: z.number().int().min(0),
  price: z.number().int().min(0),
  imageId: z.number().int().min(1),
  image: z.custom<MediaByFolder<'variant'>>().optional(),
  costPerItem: z.number().int().min(0),
  position: z.number().int().min(0),
  compareAt: z.number().int().min(0).optional(),
});

export type AddVariantSchema = z.infer<typeof addVariantSchema>;
