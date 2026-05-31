import z from 'zod';

export const addOrderItemSchema = z.object({
  externalId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const updateOrderItemSchema = z.object({
  quantity: z.number().int().min(1),
});

export type AddOrderItemSchema = z.infer<typeof addOrderItemSchema>;
export type UpdateOrderItemSchema = z.infer<typeof updateOrderItemSchema>;
