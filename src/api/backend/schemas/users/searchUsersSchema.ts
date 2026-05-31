import z from 'zod';

export const searchUsersSchema = z.object({
  q: z.string().optional(),
});

export type SearchUsersSchema = z.infer<typeof searchUsersSchema>;
