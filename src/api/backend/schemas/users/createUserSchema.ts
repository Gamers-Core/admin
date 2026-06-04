import z from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.email({ message: 'Email must be a valid email address' }),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
