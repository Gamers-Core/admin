import z, { ZodObject } from 'zod';

import { AppSettingsKey } from '@/api';
import { maintenanceModeSchema } from './maintenanceModeSchema';
import { announcementSchema } from './announcementSchema';

export const appSettingsSchemas = {
  maintenanceMode: maintenanceModeSchema,
  announcement: announcementSchema,
} as const satisfies Record<AppSettingsKey, ZodObject>;

export type AppSettingsSchemas = {
  [K in AppSettingsKey]: z.infer<(typeof appSettingsSchemas)[K]>;
};
