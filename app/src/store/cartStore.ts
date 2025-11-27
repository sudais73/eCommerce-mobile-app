import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../types/product";
import { api } from "../utils/api";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];

  loadCart: () => Promise<void>;
  syncWithServer: () => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;

  addToCart: (product: Product, qty?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  

  clearCart: () => Promise<void>;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  // 🔄 Load local cart on startup
  
  loadCart: async () => {
    try {
      const saved = await AsyncStorage.getItem("cart");
      if (saved) {
        set({ items: JSON.parse(saved) });
      }
    } catch (err) {
      console.log("Failed to load cart:", err);
    }
  },

  // 🔄 Sync cart with backend after login
  syncWithServer: async () => {
    try {
      const res = await api.get("/auth/get-cart-data");
      const serverCart = res.data;

      

      set({ items: res.data });
     
      await AsyncStorage.setItem("cart", JSON.stringify(res.data));
    } catch {
      console.log("Cart sync failed");
    }
  },

  // 🟢 Add to cart + sync backend
  addToCart: async (product, qty = 1) => {
    try {
      const res = await api.post("/auth/add-to-cart", {
        productId: product,
        quantity: qty,
      });

  

      set({ items:res.data.cartData});
      await AsyncStorage.setItem("cart", JSON.stringify(res.data)  );
      get().getTotal();
    } catch (err) {
      console.log("Add to cart failed:", err);
    }
  },

  // ❌ Remove item
  removeFromCart: async (productId) => {
    try {
      const res = await api.post("/auth/remove-fromcart", { productId });

        set({ items:res.data.cart});
      await AsyncStorage.setItem("cart", JSON.stringify(res.data.cart));
       
    } catch (err) {
      console.log("Remove error:", err);
    }
  },

  

  // 👇 Helper function to update quantity
  updateQuantity: async (productId: string, quantity: number) => {
    if (quantity < 1) {
      return get().removeFromCart(productId)};
    try {
      const res = await api.post("/auth/update-cart", {
        productId,
        quantity,
      });

      set({ items: res.data.cartData });
      await AsyncStorage.setItem("cart", JSON.stringify(res.data.cartData));
      get().getTotal();
    } catch (err) {
      console.log("Update qty failed:", err);
    }
  },

  // 🧹 Clear cart
  clearCart: async () => {
    try {
      await api.post("/auth/clear-cart");
      set({ items: [] });
      await AsyncStorage.removeItem("cart");
    } catch (err) {
      console.log("Clear cart failed:", err);
    }
  },

  // 💰 Total price
  getTotal: () =>
          get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ),

}));

