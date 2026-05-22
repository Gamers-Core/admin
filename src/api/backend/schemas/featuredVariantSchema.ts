import z from 'zod';

import { localizedSchema } from './localizedSchema';

export const featuredVariantSchema = z.object({
  title: localizedSchema,
  variantId: z.number('Variant ID is missing').min(1, 'Please select a valid variant'),
});

export type FeaturedVariantSchema = z.infer<typeof featuredVariantSchema>;
