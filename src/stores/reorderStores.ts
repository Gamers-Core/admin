import { FAQ, UserReview } from '@/api';

import { createReorderStore } from './useReorderStore';

export const useFAQsReorderStore = createReorderStore<FAQ>();
export const useUserReviewsReorderStore = createReorderStore<UserReview>();
