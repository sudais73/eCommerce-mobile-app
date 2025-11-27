import { useProductStore } from "../store/productStore";

export function useProducts() {
  const { products, getProductById, setProducts, getProducts } = useProductStore();


  return { products, getProductById, setProducts, getProducts };
}
