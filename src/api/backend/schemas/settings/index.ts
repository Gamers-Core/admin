import z, { ZodObject } from 'zod';

import { AppSettingsKey } from '@/api';
import { maintenanceModeSchema } from './maintenanceModeSchema';

export const appSettingsSchemas = {
  maintenanceMode: maintenanceModeSchema,
} as const satisfies Record<AppSettingsKey, ZodObject>;

export type AppSettingsSchemas = {
  [K in AppSettingsKey]: z.infer<(typeof appSettingsSchemas)[K]>;
};
