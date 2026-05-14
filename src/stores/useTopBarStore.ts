import { create } from 'zustand';
import { ReactNode } from 'react';

interface TopBarStore {
  cta: ReactNode;
  setCta: (cta: ReactNode) => void;
  clearCta: () => void;
}

export const useTopBarStore = create<TopBarStore>()((set) => ({
  cta: null,
  setCta: (cta) => set({ cta }),
  clearCta: () => set({ cta: null }),
}));
