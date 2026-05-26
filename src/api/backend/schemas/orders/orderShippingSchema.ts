import z from 'zod';

export const orderShippingSchema = z.object({
  trackingNumber: z.string(),
});

export type OrderShippingSchema = z.infer<typeof orderShippingSchema>;
