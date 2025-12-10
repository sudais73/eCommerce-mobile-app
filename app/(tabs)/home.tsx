import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductList from "@/components/ProductList";
import { View, ScrollView, StyleSheet } from "react-native";
import {useAuthStore} from '../src/store/authStore'
import {useProductStore} from '../src/store/productStore'
import {useEffect} from 'react'
import { useOrderStore } from "../src/store/orderStore";
import { useCartStore } from "../src/store/cartStore";

export default function HomeScreen() {
  const {loadUser, user, token} = useAuthStore()
  const items = useCartStore((s) => s.items);
  const syncWithServer = useCartStore((s) => s.syncWithServer);
  const { products, getProducts } = useProductStore();
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
    loadUser()
    getProducts()
    syncWithServer()
    fetchOrders()
    console.log('====================================');
    console.log(user, token, products, items);
    console.log('====================================');
  }, [token])
  
  return (
    <View style={styles.container}>
      <Header/>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroBanner/>
        <ProductList />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 80, 
    paddingBottom: 20,
  },
});