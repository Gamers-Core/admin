import z from 'zod';

export const userReviewSchema = z.object({
  facebookURL: z.url('Please enter a valid Facebook URL'),
  imageId: z.number('Image is missing').min(1, 'Please upload an image for the user review'),
});

export type UserReviewSchema = z.infer<typeof userReviewSchema>;
