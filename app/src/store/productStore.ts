import { create } from "zustand";
import { Product } from "../types/product";
import { api } from "../utils/api";

interface ProductStore {
  products: Product[];
  searchQuery: string;
  currentProduct: Product | null; // Added to store single product
  loading: boolean; // Added loading state
  error: string | null; // Added error state

  getProducts: () => Promise<void>;
  setProducts: (data: Product[]) => void;
  getProductById: (id: string) => Promise<Product | void>;
  setSearchQuery: (query: string) => void; // Added missing function
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  searchQuery: "",
  currentProduct: null,
  loading: false,
  error: null,

  // Fetch all products
  getProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/products");
      set({ products: data, loading: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({
        error: "Failed to fetch products",
        loading: false
      });
    }
  },

  setProducts: (data) => set({ products: data }),

  // Fetch single product by ID
  getProductById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/products/${id}`);
      set({ currentProduct: data, loading: false });
      return data; // Return the product data
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      set({
        error: "Failed to fetch product",
        loading: false
      });
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));