import { create } from 'zustand';

import { FAQ } from '@/api';

interface FAQsReorderStoreState {
  queryFAQs: FAQ[];
  faqs: FAQ[] | null;
  isLoading: boolean;
  isReordered: boolean;
}

interface FAQsReorderStoreActions {
  setQueryFAQs: (faqs: FAQ[]) => void;
  setFAQs: (faqs: FAQ[] | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

type FAQsReorderStore = FAQsReorderStoreState & FAQsReorderStoreActions;

const defaultState: FAQsReorderStoreState = {
  queryFAQs: [],
  faqs: null,
  isLoading: false,
  isReordered: false,
};

export const useFAQsReorderStore = create<FAQsReorderStore>((set) => ({
  ...defaultState,
  setQueryFAQs: (faqs) => set({ queryFAQs: faqs, faqs, isReordered: false }),
  setFAQs: (newFAQs) =>
    set(({ queryFAQs }) => {
      const isReordered = !!newFAQs && newFAQs.some(({ position }, index) => queryFAQs?.[index].position !== position);

      return { faqs: newFAQs, isReordered };
    }),
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => set(({ queryFAQs }) => ({ faqs: queryFAQs, isReordered: false })),
}));
