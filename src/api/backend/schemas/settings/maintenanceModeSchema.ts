import z from 'zod';
import { optionalLocalizedSchema } from '../localizedSchema';

export const maintenanceModeSchema = z.object({
  enabled: z.boolean(),
  message: optionalLocalizedSchema.optional(),
  countdown: z.string().nullable().optional(),
});

export type MaintenanceModeSchema = z.infer<typeof maintenanceModeSchema>;
