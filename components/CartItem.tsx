import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { CartItem as CartItemType, useCartStore } from "../app/src/store/cartStore";

type Props = {
  item: CartItemType;
};

export default function CartItem({ item }: Props) {
  const {updateQuantity, removeFromCart } = useCartStore();

  return (
    <View style={styles.row}>
      <Image
        source={{ uri: item.product.image }}
        style={styles.image}
      />

      <View style={styles.body}>
        <Text style={styles.title}>{item.product.title}</Text>

        <Text style={styles.price}>
          Birr {item.product.price * item.quantity}
        </Text>

        <View style={styles.controls}>
          {/* decrease */}
          <Pressable
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
            style={styles.controlBtn}
          >
            <Text style={styles.controlText}>-</Text>
          </Pressable>

          <Text style={styles.qty}>{item.quantity}</Text>

          {/* increase */}
          <Pressable
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
            style={styles.controlBtn}
          >
            <Text style={styles.controlText}>+</Text>
          </Pressable>

          {/* remove */}
          <Pressable
            onPress={() => removeFromCart(item.product.id)}
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
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  body: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 15,
  },
  price: {
    marginTop: 6,
    color: "#0A8A34",
    fontWeight: "700",
  },
  controls: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  controlBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  controlText: {
    fontSize: 16,
    fontWeight: "700",
  },
  qty: {
    minWidth: 28,
    textAlign: "center",
    fontWeight: "700",
  },
  removeBtn: {
    marginLeft: 12,
  },
  removeText: {
    color: "#FF3B30",
    fontWeight: "600",
  },
});
