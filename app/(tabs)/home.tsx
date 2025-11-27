import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductList from "@/components/ProductList";
import { View, ScrollView, StyleSheet } from "react-native";
import {useAuthStore} from '../src/store/authStore'
import {useProductStore} from '../src/store/productStore'
import {useEffect} from 'react'
import { useOrderStore } from "../src/store/orderStore";
// import { useOrderStore } from "../src/store/orderStore";

export default function HomeScreen() {
  const {loadUser, user, token} = useAuthStore()
// const{ orders, getMyOrders} = useOrderStore();

const { products ,getProducts} = useProductStore();
    const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
  loadUser()
  getProducts()
  fetchOrders()
  console.log('====================================');
  console.log(user,token, products);
  console.log('====================================');
  }, [token])
  
  return (
    <ScrollView style={styles.container}>
      <Header/>
      <HeroBanner/>
      <ProductList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});
