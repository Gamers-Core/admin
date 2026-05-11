import z from 'zod';

import { localizedSchema } from './localizedSchema';

export const categorySchema = z.object({ name: localizedSchema });

export type CategorySchema = z.infer<typeof categorySchema>;
