import z from 'zod';

import { addBrandSchema } from './addBrandSchema';

export const updateBrandSchema = addBrandSchema.partial();
export type UpdateBrandSchema = z.infer<typeof updateBrandSchema>;
