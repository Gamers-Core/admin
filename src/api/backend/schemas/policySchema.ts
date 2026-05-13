import z from 'zod';
import { localizedSchema } from './localizedSchema';

export const policySchema = z.object({
  value: localizedSchema,
});

export type PolicySchema = z.infer<typeof policySchema>;
