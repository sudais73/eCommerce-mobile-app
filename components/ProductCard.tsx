import { useCartStore } from "@/app/src/store/cartStore";
import { Link } from "expo-router";
import { View, Text, Image, Pressable, StyleSheet, TouchableOpacity } from "react-native";

export default function ProductCard({ product }: { product: { image: string; title: string; price: number; id:any } }) {

    const {addToCart} = useCartStore();
  return (
    <Link
  href={{
    pathname: "/product/[id]",
    params: { id: product.id }, // pass the product id
  }}
  asChild
>
    <Pressable style={styles.card}>
      <Image source={{ uri: product.image}} style={styles.image} />

      <Text style={styles.title}>{product.title}</Text>
        <View style={styles.priceAndAddToCartContainer}>
       <Text style={styles.price}>${product.price}</Text>
       <TouchableOpacity 
       onPress={()=>addToCart(product.id, 1)}
       
       >
            <Text style={{ color: 'blue', marginTop: 8 }}>Add to Cart</Text>
       </TouchableOpacity>

        </View>
    </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  title: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "600",
  },
  price: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "700",
    color: "#0A8A34",
  },
  priceAndAddToCartContainer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
