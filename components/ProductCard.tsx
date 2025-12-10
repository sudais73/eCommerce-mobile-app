import { useCartStore } from "@/app/src/store/cartStore";
import { Link, useRouter } from "expo-router";
import { View, Text, Image, Pressable, StyleSheet, TouchableOpacity } from "react-native";

export default function ProductCard({ product }: { product: { image: string; title: string; price: number; _id: any } }) {
  const { addToCart } = useCartStore();
  const router = useRouter();

  const handleCardPress = () => {
    router.push({
      pathname: "/product/[id]",
      params: { id: product._id },
    });
  };

  return (
    <Pressable 
      style={styles.card} 
      onPress={handleCardPress}
    >
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <View style={styles.priceAndAddToCartContainer}>
        <Text style={styles.price}>${product.price}</Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            addToCart(product._id, 1);
          }}
          style={styles.addToCartButton}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
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
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    flexShrink: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A8A34",
  },
  priceAndAddToCartContainer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addToCartButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#007AFF",
    borderRadius: 6,
    minHeight: 36, // Minimum touch target size
    justifyContent: "center",
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});