import z from 'zod';

export const verifyOTPSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .refine((value) => /^\d+$/.test(value), 'OTP must contain only digits'),
});

export type VerifyOTPSchema = z.infer<typeof verifyOTPSchema>;
