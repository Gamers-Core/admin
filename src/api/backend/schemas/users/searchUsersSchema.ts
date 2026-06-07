import z from 'zod';

import { sortUserOptions } from '../../const';

export const searchUsersSchema = z.object({
  q: z.string().optional(),
  sort: z.enum(sortUserOptions).optional(),
});

export type SearchUsersSchema = z.infer<typeof searchUsersSchema>;
