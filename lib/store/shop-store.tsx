"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";

interface ShopState {
  cart: Record<string, number>;
  wishlist: string[];
  toast: { id: number; message: string } | null;
}

type Action =
  | { type: "ADD_TO_CART"; productId: string; qty?: number }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "SET_QTY"; productId: string; qty: number }
  | { type: "TOGGLE_WISHLIST"; productId: string }
  | { type: "CLEAR_CART" }
  | { type: "SHOW_TOAST"; message: string }
  | { type: "CLEAR_TOAST" }
  | { type: "HYDRATE"; state: Partial<ShopState> };

const initial: ShopState = { cart: {}, wishlist: [], toast: null };

function reducer(state: ShopState, action: Action): ShopState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const next = { ...state.cart };
      next[action.productId] = (next[action.productId] ?? 0) + (action.qty ?? 1);
      return { ...state, cart: next };
    }
    case "REMOVE_FROM_CART": {
      const next = { ...state.cart };
      delete next[action.productId];
      return { ...state, cart: next };
    }
    case "SET_QTY": {
      const next = { ...state.cart };
      if (action.qty <= 0) delete next[action.productId];
      else next[action.productId] = action.qty;
      return { ...state, cart: next };
    }
    case "TOGGLE_WISHLIST": {
      const has = state.wishlist.includes(action.productId);
      return {
        ...state,
        wishlist: has
          ? state.wishlist.filter((id) => id !== action.productId)
          : [...state.wishlist, action.productId],
      };
    }
    case "CLEAR_CART":
      return { ...state, cart: {} };
    case "SHOW_TOAST":
      return { ...state, toast: { id: Date.now(), message: action.message } };
    case "CLEAR_TOAST":
      return { ...state, toast: null };
    case "HYDRATE":
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface ShopContextValue extends ShopState {
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  toast: ShopState["toast"];
  cartCount: number;
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hydrate from localStorage. Cart/wishlist keys are now product CODES
  // (RV-NNNN). Anything that doesn't match that shape is from an older
  // build (static p_001 ids, raw cuids) and gets dropped at hydrate-time
  // so the cart/wishlist pages don't waste a round-trip + spinner on
  // entries that can never resolve.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("rv:shop");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<ShopState>;
      const isCode = (s: string) => /^RV[-_]?\d{2,5}$/i.test(s);
      const cleanCart: Record<string, number> = {};
      Object.entries(parsed.cart ?? {}).forEach(([k, v]) => {
        if (isCode(k)) cleanCart[k] = v;
      });
      const cleanWishlist = (parsed.wishlist ?? []).filter(isCode);
      dispatch({ type: "HYDRATE", state: { cart: cleanCart, wishlist: cleanWishlist } });
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem("rv:shop", JSON.stringify({ cart: state.cart, wishlist: state.wishlist }));
    } catch {}
  }, [state.cart, state.wishlist]);

  // auto-clear toast
  useEffect(() => {
    if (state.toast) {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 2400);
    }
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [state.toast]);

  const addToCart = useCallback((productId: string, qty = 1) => {
    dispatch({ type: "ADD_TO_CART", productId, qty });
    dispatch({ type: "SHOW_TOAST", message: "Added to your bag" });
  }, []);
  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId });
  }, []);
  const setQty = useCallback((productId: string, qty: number) => {
    dispatch({ type: "SET_QTY", productId, qty });
  }, []);
  const toggleWishlist = useCallback((productId: string) => {
    dispatch({ type: "TOGGLE_WISHLIST", productId });
    dispatch({ type: "SHOW_TOAST", message: "Wishlist updated" });
  }, []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const value = useMemo<ShopContextValue>(() => {
    const cartCount = Object.values(state.cart).reduce((a, b) => a + b, 0);
    return {
      ...state,
      addToCart,
      removeFromCart,
      setQty,
      toggleWishlist,
      clearCart,
      cartCount,
      wishlistCount: state.wishlist.length,
      isInWishlist: (id: string) => state.wishlist.includes(id),
    };
  }, [state, addToCart, removeFromCart, setQty, toggleWishlist, clearCart]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
