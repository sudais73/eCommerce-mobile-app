import { create } from "zustand";
import { api } from "../utils/api";
import { useCartStore } from "./cartStore";

// --------- TYPES ---------//

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

interface OrderStore {
  orders: Order[];

  createOrder: () => Promise<string>;
  fetchOrders: () => Promise<void>;
  updatePaymentStatus: (orderId: string) => Promise<string>;
}

// --------- STORE ---------

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],

  // -------- CREATE ORDER --------
  createOrder: async () => {
    try {
      const cartState = useCartStore.getState();
      const cartItems = cartState.items;
      const total = cartState.getTotal();

      if (cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // Format cart items -> backend format
      const formattedItems: OrderItem[] = cartItems.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      }));

      const res = await api.post("/orders/create", {
        items: formattedItems,
        total,
      });

      const newOrder: Order = res.data.order;

      // Add new order to state
      set((state) => ({
        orders: [newOrder, ...state.orders],
      }));

      // Clear cart after successful order
      await cartState.clearCart();
      await get().fetchOrders();

      return "Order created";
    } catch (error: any) {
      console.log("Order error:", error);
      throw new Error(error.message || "Order failed");
    }
  },

  // -------- GET USER ORDERS --------
  fetchOrders: async () => {
    try {
      const res = await api.get("/orders/my-orders");
      set({ orders: res.data as Order[] });
    } catch (error) {
      console.log("Fetch orders error:", error);
    }
  },

   updatePaymentStatus: async (orderId: string) => {
  try {
    const res = await api.post("/orders/update-payment", { orderId });

    return "Payment updated";
  } catch (error: any) {
    console.log("Payment update error:", error);
    throw new Error(error.message || "Failed to update payment");
  }
},
}));


