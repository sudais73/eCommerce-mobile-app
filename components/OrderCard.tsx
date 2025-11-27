import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { api } from "@/app/src/utils/api";

type OrderItem = {
  image: string;
  title: string;
  price: number | string;
  quantity: number;
};

type Order = {
  _id: string;
  status: "Delivered" | "Processing" | "Pending" | string;
  items: OrderItem[];
  date: string;
  total: number | string;
  paid: boolean;
};

type OrderCardProps = {
  order: Order;
  onCancel: (id: string) => void;
};

// 🔹 PAYMENT FUNCTION
async function handlePayment(orderId: string) {
  try {
    const res = await api.post("/payments/create-payment-intent", { orderId });

    if (res.data?.url) {
      await WebBrowser.openBrowserAsync(res.data.url, {
         presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });
    }
  } catch (error) {
    console.log("Payment Error:", error);
  }
}

export default function OrderCard({ order, onCancel }: OrderCardProps) {
  const statusColor:any = {
    Delivered: "green",
    Processing: "orange",
    Pending: "red",
  } as const;

  return (
    <View style={styles.container}>
      {/* Status */}
      <View style={styles.headerRow}>
        <Text
          style={[styles.status, { color: statusColor[order.status] || "black" }]}
        >
          {order.status}
        </Text>
      </View>

      {/* Items */}
      {order.items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />

          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemPrice}>{item.price} birr</Text>
            <Text style={styles.itemPrice}>Quantity: {item.quantity}</Text>
          </View>
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footerRow}>
        <Text style={styles.date}>{order.date}</Text>
        <Text style={styles.total}>Total: {order.total} birr</Text>
      </View>

      {/* Payment + Cancel */}
      <View style={styles.paymentRow}>
        {order.paid ? (
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>PAID</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.payNowBtn}
            onPress={() => handlePayment(order._id)}
          >
            <Text style={styles.payNowText}>Pay Now</Text>
          </TouchableOpacity>
        )}

        {!order.paid && order.status !== "Delivered" && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => onCancel(order._id)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  status: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  itemPrice: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  date: {
    fontSize: 13,
    opacity: 0.6,
  },

  total: {
    fontSize: 15,
    fontWeight: "700",
  },

  paymentRow: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  paidBadge: {
    backgroundColor: "green",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  paidText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
  },

  payNowBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },

  payNowText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },

  cancelBtn: {
    backgroundColor: "#ffcc00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 10,
  },

  cancelText: {
    fontWeight: "700",
    color: "#664d00",
  },
});
