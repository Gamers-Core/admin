import { FAQ, MediaByFolder, UserReview } from '@/api';

import { createReorderStore } from './useReorderStore';

export const useFAQsReorderStore = createReorderStore<FAQ>();
export const useUserReviewsReorderStore = createReorderStore<UserReview>();
export const useProductsMediaReorderStore = createReorderStore<MediaByFolder<'product'> & { position: number }>();
