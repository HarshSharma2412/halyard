'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, SavedItem, Currency } from './types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, finishId: string, size?: string) => void;
  updateQty: (productId: string, finishId: string, size: string | undefined, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

interface SavedStore {
  items: SavedItem[];
  toggle: (productId: string, finishId: string) => void;
  isSaved: (productId: string, finishId: string) => boolean;
}

interface UIStore {
  cartOpen: boolean;
  quickViewId: string | null;
  currency: Currency;
  theme: 'dark' | 'light';
  bagPop: boolean;
  setCartOpen: (open: boolean) => void;
  setQuickView: (id: string | null) => void;
  setCurrency: (c: Currency) => void;
  toggleTheme: () => void;
  triggerBagPop: () => void;
}

function matchKey(a: CartItem, productId: string, finishId: string, size?: string) {
  return a.productId === productId && a.finishId === finishId && a.size === size;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((s) => {
          const idx = s.items.findIndex(i => matchKey(i, item.productId, item.finishId, item.size));
          if (idx >= 0) {
            const next = [...s.items];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
            return { items: next };
          }
          return { items: [...s.items, item] };
        });
      },
      removeItem: (productId, finishId, size) =>
        set((s) => ({ items: s.items.filter(i => !matchKey(i, productId, finishId, size)) })),
      updateQty: (productId, finishId, size, qty) =>
        set((s) => ({
          items: s.items.map(i =>
            matchKey(i, productId, finishId, size) ? { ...i, quantity: qty } : i
          ).filter(i => i.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: 'halyard-cart' }
  )
);

export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId, finishId) => {
        const exists = get().items.some(i => i.productId === productId && i.finishId === finishId);
        if (exists) {
          set(s => ({ items: s.items.filter(i => !(i.productId === productId && i.finishId === finishId)) }));
        } else {
          set(s => ({ items: [...s.items, { productId, finishId }] }));
        }
      },
      isSaved: (productId, finishId) =>
        get().items.some(i => i.productId === productId && i.finishId === finishId),
    }),
    { name: 'halyard-saved' }
  )
);

export const useUIStore = create<UIStore>()((set) => ({
  cartOpen: false,
  quickViewId: null,
  currency: 'EUR',
  theme: 'dark',
  bagPop: false,
  setCartOpen: (open) => set({ cartOpen: open }),
  setQuickView: (id) => set({ quickViewId: id }),
  setCurrency: (c) => set({ currency: c }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  triggerBagPop: () => {
    set({ bagPop: true });
    setTimeout(() => set({ bagPop: false }), 600);
  },
}));
