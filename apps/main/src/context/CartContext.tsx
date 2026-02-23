import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Product, CartItem } from '@mlc/shared-types';
import { getAllCartItems, addToCart, updateCartItem, deleteCartItem, getProduct } from '../utils/apiClient';
import { useAuth } from './AuthContext';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Cart item enriched with full product details for display */
export interface CartItemWithProduct {
  cartItemId: number;       // Xano cart record id
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItemWithProduct[];
  cartCount: number;
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Local-storage helpers for guest cart                                */
/* ------------------------------------------------------------------ */

const LS_KEY = 'mlc_guest_cart';

interface GuestCartEntry { productId: number; product: Product; quantity: number }

function loadGuestCart(): GuestCartEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveGuestCart(entries: GuestCartEntry[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(entries));
}

function clearGuestCart() {
  localStorage.removeItem(LS_KEY);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasSynced = useRef(false);

  /* ---------- load cart on mount / auth change ---------- */
  const loadCart = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isLoggedIn && user) {
        // Authenticated → try to fetch from Xano, fall back to localStorage
        try {
          const response = await getAllCartItems();
          const cartItems: CartItem[] = Array.isArray(response) ? response : (response as any)?.items ?? [];
          
          // Enrich each cart item with product details
          const enriched: CartItemWithProduct[] = [];
          for (const ci of cartItems) {
            // Guard against product_id = 0 or undefined
            if (!ci.product_id || ci.product_id <= 0) {
              console.warn(`[CartContext] Skipping invalid product_id: ${ci.product_id}`);
              continue;
            }
            try {
              const product = await getProduct(ci.product_id);
              enriched.push({ cartItemId: ci.id, product, quantity: ci.quantity });
            } catch {
              // Product may have been deleted — skip
            }
          }
          setItems(enriched);
        } catch (err) {
          console.error('[CartContext] failed to load remote cart, using localStorage fallback:', err);
          // Fall back to guest cart in localStorage
          const guest = loadGuestCart();
          setItems(guest.map((g, idx) => ({
            cartItemId: -(idx + 1),
            product: g.product,
            quantity: g.quantity,
          })));
        }
      } else {
        // Guest → use localStorage
        const guest = loadGuestCart();
        setItems(guest.map((g, idx) => ({
          cartItemId: -(idx + 1), // negative ids for guest items
          product: g.product,
          quantity: g.quantity,
        })));
      }
    } catch (err) {
      console.error('[CartContext] loadCart error:', err);
      // Last resort: load guest cart
      const guest = loadGuestCart();
      setItems(guest.map((g, idx) => ({
        cartItemId: -(idx + 1),
        product: g.product,
        quantity: g.quantity,
      })));
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /* ---------- Sync guest cart → remote on login ---------- */
  useEffect(() => {
    if (!isLoggedIn || !user || hasSynced.current) return;
    hasSynced.current = true;

    const guest = loadGuestCart();
    if (guest.length === 0) return;

    (async () => {
      for (const entry of guest) {
        try {
          await addToCart({ user_id: Number(user.id) || 0, product_id: entry.productId, quantity: entry.quantity });
        } catch { /* ignore duplicates */ }
      }
      clearGuestCart();
      loadCart();
    })();
  }, [isLoggedIn, user, loadCart]);

  /* ---------- actions ---------- */
  const addItem = useCallback(async (product: Product, quantity = 1) => {
    // Always save to localStorage as backup
    const guest = loadGuestCart();
    const existing = guest.find(g => g.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      guest.push({ productId: product.id, product, quantity });
    }
    saveGuestCart(guest);

    if (isLoggedIn && user) {
      try {
        await addToCart({ user_id: Number(user.id) || 0, product_id: product.id, quantity });
        await loadCart();
      } catch (err) {
        console.error('[CartContext] addToCart API failed, using localStorage:', err);
        // Still update local state from localStorage
        setItems(guest.map((g, idx) => ({
          cartItemId: -(idx + 1),
          product: g.product,
          quantity: g.quantity,
        })));
      }
    } else {
      // Guest cart - update state from localStorage
      setItems(guest.map((g, idx) => ({
        cartItemId: -(idx + 1),
        product: g.product,
        quantity: g.quantity,
      })));
    }
  }, [isLoggedIn, user, loadCart]);

  const removeItem = useCallback(async (cartItemId: number) => {
    if (isLoggedIn && cartItemId > 0) {
      try {
        await deleteCartItem(cartItemId);
        await loadCart();
      } catch (err) {
        console.error('[CartContext] removeItem failed:', err);
      }
    } else {
      // Guest removal by negative index
      const guest = loadGuestCart();
      const idx = Math.abs(cartItemId) - 1;
      guest.splice(idx, 1);
      saveGuestCart(guest);
      await loadCart();
    }
  }, [isLoggedIn, loadCart]);

  const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    if (quantity < 1) { await removeItem(cartItemId); return; }

    if (isLoggedIn && cartItemId > 0) {
      try {
        await updateCartItem(cartItemId, { quantity } as any);
        await loadCart();
      } catch (err) {
        console.error('[CartContext] updateQuantity failed:', err);
      }
    } else {
      const guest = loadGuestCart();
      const idx = Math.abs(cartItemId) - 1;
      if (guest[idx]) { guest[idx].quantity = quantity; }
      saveGuestCart(guest);
      await loadCart();
    }
  }, [isLoggedIn, loadCart, removeItem]);

  const clearCartFn = useCallback(() => {
    if (!isLoggedIn) {
      clearGuestCart();
    }
    setItems([]);
  }, [isLoggedIn]);

  /* ---------- derived ---------- */
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, cartCount, isLoading, addItem, removeItem, updateQuantity, clearCart: clearCartFn, total }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
