import { FAQ } from '@/api';
import { createReorderStore } from './useReorderStore';

export const useFAQsReorderStore = createReorderStore<FAQ>();
