import { create } from "zustand";
import { api } from "../utils/api";
import { useCartStore, CartItem as CartItemType } from "./cartStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --------- TYPES ---------//

export interface OrderItem {
  productId: string;
  name: string;
  title?: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt?: string;
}

interface OrderStore {
  orders: Order[];
  loading: boolean;
  error: string | null;

  createOrder: () => Promise<string>;
  fetchOrders: () => Promise<void>;
  updatePaymentStatus: (orderId: string) => Promise<string>;
}

// --------- STORE ---------

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  // -------- CREATE ORDER --------
  createOrder: async () => {
    try {
      set({ loading: true, error: null });

      const cartState = useCartStore.getState();
      const cartItems = cartState.items;
      const total = cartState.getTotal();

      console.log("Creating order with cart items:", cartItems);
      console.log("Total:", total);

      if (cartItems.length === 0) {
        throw new Error("Cart is empty");
      }





      // Format cart items -> backend format
      const formattedItems: OrderItem[] = cartItems.map((item: CartItemType) => {
        const product = item.productDetails!;
        return {
          productId: item.productId,
          name: product.title || "Product",
          title: product.title,
          price: product.price,
          image: product.image || "",
          quantity: item.quantity,
        };
      });

      console.log("Formatted items for order:", formattedItems);

      const res = await api.post("/orders/create", {
        items: formattedItems,
        total,
      });

      console.log("Order creation response:", res.data);

      const newOrder: Order = res.data.order || res.data;

      // Add new order to state
      set((state) => ({
        orders: [newOrder, ...state.orders],
        loading: false,
        error: null
      }));

      // Save to local storage for offline access
      await AsyncStorage.setItem('orders', JSON.stringify([newOrder, ...get().orders]));

      // Clear cart after successful order
      await cartState.clearCart();

      // Refresh orders list
      await get().fetchOrders();

      return "Order created successfully";
    } catch (error: any) {
      console.log("Order error:", error);
      const errorMessage = error.response?.data?.msg || error.message || "Order failed";
      set({
        loading: false,
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
  },

  // -------- GET USER ORDERS --------
  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });

      // Try to load from cache first
      try {
        const cached = await AsyncStorage.getItem('orders');
        if (cached) {
          const parsedOrders = JSON.parse(cached);
          set({ orders: parsedOrders });
        }
      } catch (cacheError) {
        console.log("Cache load error:", cacheError);
      }

      // Fetch fresh data from server
      const res = await api.get("/orders/my-orders");

      const ordersData = Array.isArray(res.data) ? res.data :
        res.data.orders ? res.data.orders :
          [];

      set({
        orders: ordersData,
        loading: false,
        error: null
      });

      // Update cache
      await AsyncStorage.setItem('orders', JSON.stringify(ordersData));
    } catch (error: any) {
      console.log("Fetch orders error:", error);
      const errorMessage = error.response?.data?.msg || error.message || "Failed to fetch orders";
      set({
        loading: false,
        error: errorMessage
      });
    }
  },

  // -------- UPDATE PAYMENT STATUS --------
  updatePaymentStatus: async (orderId: string) => {
    try {
      set({ loading: true, error: null });

      const res = await api.post("/orders/update-payment", { orderId });

      // Update the specific order in state
      set((state) => ({
        orders: state.orders.map(order =>
          order._id === orderId
            ? { ...order, ...res.data.order, paymentStatus: res.data.paymentStatus }
            : order
        ),
        loading: false,
        error: null
      }));

      // Update cache
      await AsyncStorage.setItem('orders', JSON.stringify(get().orders));

      return "Payment updated successfully";
    } catch (error: any) {
      console.log("Payment update error:", error);
      const errorMessage = error.response?.data?.msg || error.message || "Failed to update payment";
      set({
        loading: false,
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
  }

}));