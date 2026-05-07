import z from 'zod';

export const signinSchema = z.object({
  email: z.email('Invalid email address').nonempty('Email is required'),
});

export type SigninSchema = z.infer<typeof signinSchema>;
