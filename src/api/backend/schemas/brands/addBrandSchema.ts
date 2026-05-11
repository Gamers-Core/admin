import z from 'zod';

import { localizedSchema } from '../localizedSchema';

export const addBrandSchema = z.object({
  name: localizedSchema,
  imageId: z.number('Image is missing').min(1, 'Please upload an image for the brand'),
});

export type AddBrandSchema = z.infer<typeof addBrandSchema>;
