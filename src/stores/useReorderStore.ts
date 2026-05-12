import { create } from 'zustand';

interface ReorderableItem {
  position: number;
}

interface ReorderStoreState<T extends ReorderableItem> {
  queryItems: T[];
  items: T[] | null;
  isLoading: boolean;
  isReordered: boolean;
}

interface ReorderStoreActions<T extends ReorderableItem> {
  setQueryItems: (items: T[]) => void;
  setItems: (items: T[] | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

type ReorderStore<T extends ReorderableItem> = ReorderStoreState<T> & ReorderStoreActions<T>;

export const createReorderStore = <T extends ReorderableItem>() =>
  create<ReorderStore<T>>((set) => ({
    queryItems: [],
    items: null,
    isLoading: false,
    isReordered: false,

    setQueryItems: (items) => set({ queryItems: items, items, isReordered: false }),

    setItems: (newItems) =>
      set(({ queryItems }) => {
        const isReordered =
          !!newItems && newItems.some(({ position }, index) => queryItems[index]?.position !== position);
        return { items: newItems, isReordered };
      }),

    setIsLoading: (isLoading) => set({ isLoading }),

    reset: () => set(({ queryItems }) => ({ items: queryItems, isReordered: false })),
  }));
