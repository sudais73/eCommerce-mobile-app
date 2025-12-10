import { View, TextInput, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCartStore } from "@/app/src/store/cartStore";

export default function Header() {
      const items = useCartStore((s) => s.items);
     
  
  const router = useRouter()
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#555" />
        <TextInput 
        
        placeholder="Search products" style={styles.input} />
      </View>

  <Pressable
  style={styles.cartButton}
  onPress={() => router.push("/(tabs)/cart")}
>
  <Ionicons name="cart-outline" size={24} color="#333" />

  {items.length > 0 && (
    <View style={styles.badge}>
      <View style={styles.badgeCircle}>
        {/* show 9+ if too many */}
        <View>
          <Text style={styles.badgeText}>
            {items.length > 5 ? "5+" : items.length}
          </Text>
        </View>
      </View>
    </View>
  )}
</Pressable>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#EEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
    outlineColor: "transparent",
  },
  cartButton: {
    padding: 16,
    backgroundColor: "#EEE",
    borderRadius: 12,
  },
  badge: {
  position: "absolute",
  top: 8,
  right: 8,
},

badgeCircle: {
  backgroundColor: "red",
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 10,
  minWidth: 18,
  justifyContent: "center",
  alignItems: "center",
},

badgeText: {
  color: "#fff",
  fontSize: 10,
  fontWeight: "700",
},

});
