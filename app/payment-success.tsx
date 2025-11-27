import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderStore } from "./src/store/orderStore";
import { useEffect } from "react";

export default function PaymentSuccessScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();

  const updatePayment = useOrderStore((s) => s.updatePaymentStatus);

  useEffect(() => {
    if (orderId) {
      updatePayment(orderId as string)
        .then(() => console.log("Payment updated"))
        .catch((err) => console.log("Payment update failed:", err));
    }
  }, [orderId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Successful 🎉</Text>

      <Text style={styles.message}>
        Your payment was completed successfully!
      </Text>

      <Text style={styles.orderId}>Order ID: {orderId}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/(tabs)/orders")}
      >
        <Text style={styles.btnText}>View Your Orders</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
  },
  orderId: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
