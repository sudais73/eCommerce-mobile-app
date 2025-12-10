import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../types/product";
import { api } from "../utils/api";

export interface CartItem {
  _id?: string;
  productId: string;
  productDetails: Product | null;
  quantity: number;
  productExists: boolean;
  subtotal?: number;
  message?: string;
}

interface CartSummary {
  items: number;
  totalQuantity: number;
  subtotal: number;
}

interface CartStore {
  items: CartItem[];
  summary: CartSummary | null;

  loadCart: () => Promise<void>;
  syncWithServer: () => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;

  addToCart: (product: Product | string, qty?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  summary: null,

  // 🔄 Load local cart on startup
  loadCart: async () => {
    try {
      const saved = await AsyncStorage.getItem("cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        set({
          items: parsed.cartItems || parsed.items || [],
          summary: parsed.summary || null
        });
      }
    } catch (err) {
      console.log("Failed to load cart:", err);
    }
  },

  // 🔄 Sync cart with backend after login
  syncWithServer: async () => {
    try {
      const res = await api.get("/auth/get-cart-data");

      // Handle both old and new response formats
      const cartItems = res.data.cartItems || res.data.items || res.data;
      const summary = res.data.summary || null;

      set({
        items: Array.isArray(cartItems) ? cartItems : [],
        summary
      });

      await AsyncStorage.setItem("cart", JSON.stringify({
        cartItems,
        summary
      }));
    } catch (err: any) {
      console.log("Cart sync failed:", err.response?.data || err.message);
    }
  },

  // 🟢 Add to cart + sync backend
  addToCart: async (product, qty = 1) => {
    try {
      // Check if product is Product object or just productId string
      const productId = typeof product === 'string' ? product : product._id;

      const res = await api.post("/auth/add-to-cart", {
        productId,
        quantity: qty,
      });

      // Update local store with the returned cart data
      set({
        items: res.data.cartData || res.data.cartItems || []
      });


      await AsyncStorage.setItem("cart", JSON.stringify({
        cartItems: res.data.cartData || res.data.cartItems || [],
        summary: res.data.summary || null
      }));
      get().syncWithServer()
      get().getTotal();
    } catch (err: any) {
      console.log("Add to cart failed:", err.response?.data || err.message);
    }
  },

  // ❌ Remove item
  removeFromCart: async (productId) => {
    try {
      const res = await api.post("/auth/remove-fromcart", { productId });
      get().syncWithServer()
    } catch (err: any) {
      console.log("Remove error:", err.response?.data || err.message);
    }
  },

  // 👇 Update quantity
  updateQuantity: async (productId: string, quantity: number) => {
    if (quantity < 1) return get().removeFromCart(productId);

    try {
      const res = await api.post("/auth/update-cart", { productId, quantity });

      get().syncWithServer()
      get().getTotal();
    } catch (err: any) {
      console.log("Update qty failed:", err.response?.data || err.message);
    }
  },

  // 🧹 Clear cart
  clearCart: async () => {
    try {
      await api.post("/auth/clear-cart");
      set({
        items: [],
        summary: null
      });
      await AsyncStorage.removeItem("cart");
    } catch (err: any) {
      console.log("Clear cart failed:", err.response?.data || err.message);
    }
  },

  // 💰 Total price - uses subtotal from server or calculates locally
  getTotal: () => {
    const state = get();

    // Use server summary if available
    if (state.summary?.subtotal !== undefined) {
      return state.summary.subtotal;
    }

    // Fallback to local calculation
    return state.items.reduce((sum, item) => {
      if (item.productDetails?.price && item.quantity) {
        return sum + (item.productDetails.price * item.quantity);
      }
      return sum + (item.subtotal || 0);
    }, 0);
  },

  // 📊 Get total item count
  getItemCount: () => {
    const state = get();

    // Use server summary if available
    if (state.summary?.totalQuantity !== undefined) {
      return state.summary.totalQuantity;
    }

    // Fallback to local calculation
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}));