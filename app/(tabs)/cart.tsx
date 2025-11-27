import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "../src/store/cartStore";
import { useOrderStore } from "../src/store/orderStore";
import CartItem from "@/components/CartItem";

export default function CartScreen() {
    const items = useCartStore((s) => s.items);
    const syncWithServer = useCartStore((s) => s.syncWithServer);
    const total = useCartStore((s) => s.getTotal());
    const createOrder = useOrderStore((s) => s.createOrder);
    const router = useRouter();


    console.log('====================================');
    console.log(items);
    console.log('====================================');


    useEffect(() => {
        syncWithServer();
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your Cart</Text>
            <FlatList
                data={items}
                keyExtractor={(item) => item.product.id.toString()}
                renderItem={({ item }) => <CartItem item={item} />}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={<Text style={styles.empty}>Your cart is empty</Text>}
            />

            <View style={styles.footer}>
                <View>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>Birr {total.toFixed(2)}</Text>
                </View>

                <TouchableOpacity style={styles.checkoutBtn}
                    onPress={createOrder}>
                    <Text style={styles.checkoutText}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5"
    },
    heading: {
        fontSize: 20,
        fontWeight: "700",
        padding: 16
    },
    empty: {
        textAlign: "center",
        marginTop: 40,
        color: "#777"
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "600"
    },
    totalValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0A8A34"
    },
    checkoutBtn: {
        backgroundColor: "#3A8DFD",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8
    },
    checkoutText: {
        color: "#fff",
        fontWeight: "700"
    },
});
