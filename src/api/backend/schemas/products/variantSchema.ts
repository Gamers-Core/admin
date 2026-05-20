import z from 'zod';

import { localizedSchema } from '../localizedSchema';
import { MediaByFolder } from '../../types';

export const variantSchema = z
  .object({
    id: z.number().int().min(1).optional(),
    name: localizedSchema,
    isActive: z.boolean().optional(),
    position: z.number().int().min(0),
    stock: z.number().int().min(0),
    price: z.number().int().min(0),
    imageId: z.number().int().min(1),
    image: z.custom<MediaByFolder<'variant'>>().optional(),
    costPerItem: z.number().int().min(0),
    compareAt: z.number().int().min(0).nullable().optional(),
  })
  .refine((data) => !data.compareAt || data.compareAt > data.price, {
    message: 'Compare at price must be greater than price',
    path: ['compareAt'],
  });

export type VariantSchema = z.infer<typeof variantSchema>;
