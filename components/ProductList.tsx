import { View, FlatList, StyleSheet } from "react-native";
import ProductCard from "./ProductCard";
import { useProductStore } from "@/app/src/store/productStore";



export default function ProductList() {
    const { products} = useProductStore();


  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ gap: 16 }}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
