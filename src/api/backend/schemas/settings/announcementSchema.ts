import z from 'zod';

import { optionalLocalizedSchema } from '../localizedSchema';
import { MediaByFolder } from '../../types';

export const announcementSchema = z.object({
  enabled: z.boolean(),
  message: optionalLocalizedSchema.optional(),
  media: z.array(z.custom<MediaByFolder<'announcement'>>()).optional(),
  disableAt: z.string().nullable().optional(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;
