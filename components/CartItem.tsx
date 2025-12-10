import React from "react";
import { View, Text, Image, StyleSheet, Pressable, Alert } from "react-native";
import { CartItem as CartItemType, useCartStore } from "../app/src/store/cartStore";

type Props = {
  item: CartItemType;
};

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeFromCart } = useCartStore();

  // Check if product exists and has details
  const product = item.productDetails;
  console.log('====================================');
  console.log(product);
  console.log('====================================');
  const productName =  product?.description || "Product";
  const productPrice = product?.price || 0;
  const productImage = product?.image || null;
 

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      Alert.alert(
        "Remove item?",
        "Do you want to remove this item from your cart?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Remove", onPress: () => removeFromCart(item.productId) }
        ]
      );
    } else {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  return (
    <View style={styles.row}>
      <Image
        source={{ uri: productImage || 'https://via.placeholder.com/100' }}
        style={styles.image}
      />

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {productName}
        </Text>

        <Text style={styles.price}>
          Birr {productPrice} × {item.quantity} = Birr {(productPrice * item.quantity).toFixed(2)}
        </Text>

        <View style={styles.controls}>
          {/* decrease */}
          <Pressable
            onPress={handleDecrease}
            style={styles.controlBtn}
          >
            <Text style={styles.controlText}>-</Text>
          </Pressable>

          <Text style={styles.qty}>{item.quantity}</Text>

          {/* increase */}
          <Pressable
            onPress={handleIncrease}
            style={[
              styles.controlBtn,
            ]}
          >
            <Text style={[
              styles.controlText,
            ]}>+</Text>
          </Pressable>

          {/* remove */}
          <Pressable
          onPress={()=>removeFromCart(item.productId)}
            style={styles.removeBtn}
          >
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
        
       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unavailableRow: {
    backgroundColor: "#ffebee",
    borderLeftWidth: 4,
    borderLeftColor: "#d32f2f",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f5f5f5",
  },
  body: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 4,
  },
  unavailableText: {
    color: "#d32f2f",
    fontStyle: "italic",
  },
  unavailableSubtext: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  price: {
    marginTop: 4,
    color: "#0A8A34",
    fontWeight: "700",
    fontSize: 14,
  },
  controls: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledBtn: {
    backgroundColor: "#e0e0e0",
    opacity: 0.6,
  },
  controlText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  disabledText: {
    color: "#999",
  },
  qty: {
    minWidth: 30,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  removeBtn: {
    marginLeft: "auto",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ffeaea",
    borderRadius: 4,
  },
  removeText: {
    color: "#FF3B30",
    fontWeight: "600",
    fontSize: 12,
  },
  stockText: {
    fontSize: 11,
    color: "#666",
    marginTop: 6,
    fontStyle: "italic",
  },
});