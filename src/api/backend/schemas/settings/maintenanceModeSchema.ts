import z from 'zod';
import { localizedSchema } from '../localizedSchema';

export const maintenanceModeSchema = z.object({
  enabled: z.boolean(),
  message: localizedSchema.optional(),
  countdown: z.string().nullable().optional(),
});

export type MaintenanceModeSchema = z.infer<typeof maintenanceModeSchema>;
