import { create } from "zustand";
import axios from "axios";
import { Product } from "../types/product";

interface ProductStore {
  products: Product[];
  searchQuery: string;

  getProducts: () => Promise<void>;
  setProducts: (data: Product[]) => void;
  getProductById: (id: string | number) => Product | undefined;
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updated: Partial<Product>) => void;
  deleteProduct: (id: number) => void;

  setSearchQuery: (query: string) => void;
  filteredProducts: () => Product[];
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  searchQuery: "",

  // Fetch products
  getProducts: async () => {
    try {
      const { data } = await axios.get("https://fakestoreapi.com/products");
      set({ products: data });
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  },

  setProducts: (data) => set({ products: data }),

  getProductById: (id) =>
    get().products.find((p) => p.id === Number(id)),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  updateProduct: (id, updated) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updated } : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  // ---------- SEARCH ----------
  setSearchQuery: (query) => set({ searchQuery: query }),

  filteredProducts: () => {
    const { products, searchQuery } = get();

    if (!searchQuery.trim()) return products;

    const q = searchQuery.toLowerCase();

    return products.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  },
}));
