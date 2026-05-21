import z from 'zod';

import { variantSchema } from './variantSchema';
import { productStatuses } from '../../const';
import { localizedSchema } from '../localizedSchema';
import { MediaByFolder } from '../../types';

export const productSchema = z.object({
  name: localizedSchema,
  title: localizedSchema,
  description: localizedSchema,
  brandId: z.number().min(1),
  categoryId: z.number().int().min(1),
  status: z.enum(productStatuses).optional(),
  media: z.array(z.custom<MediaByFolder<'product'>>()).min(1),
  variants: z.array(variantSchema).min(1),
});

export type ProductSchema = z.infer<typeof productSchema>;
