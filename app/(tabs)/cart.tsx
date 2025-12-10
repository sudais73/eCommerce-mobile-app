import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useCartStore } from "../src/store/cartStore";
import { useOrderStore } from "../src/store/orderStore";
import CartItem from "@/components/CartItem";

export default function CartScreen() {
    const items = useCartStore((s) => s.items);
    const syncWithServer = useCartStore((s) => s.syncWithServer);
    const getTotal = useCartStore((s) => s.getTotal);
    const getItemCount = useCartStore((s) => s.getItemCount);
    const total = getTotal();
    const itemCount = getItemCount();

    const createOrder = useOrderStore((s) => s.createOrder);
    const router = useRouter();

    useEffect(() => {
        syncWithServer();
    }, []);

    const handleCheckout = async () => {
        if (items.length === 0) {
            Alert.alert("Cart is empty", "Please add items to cart before checkout");
            return;
        }
        
        // Check if any items are unavailable
        const unavailableItems = items.filter(item => !item.productExists);
        if (unavailableItems.length > 0) {
            Alert.alert(
                "Some items unavailable", 
                `${unavailableItems.length} item(s) in your cart are no longer available. Please remove them before checkout.`
            );
            return;
        }
        
        try {
            await createOrder();
            // Navigate to order confirmation or clear cart
            router.push("/orders");
        } catch (error) {
            Alert.alert("Checkout failed", "Unable to complete checkout. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your Cart ({itemCount} items)</Text>
            
            <FlatList
                data={items}
                keyExtractor={(item) => item.productId || item._id || Math.random().toString()}
                renderItem={({ item }) => <CartItem item={item} />}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.empty}>Your cart is empty</Text>
                        <Link href={'/(tabs)/home'} style={styles.goToProducts}>Go to Products to add items</Link>
                    </View>
                }
            />

            {items.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>Birr {total.toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity 
                        style={[
                            styles.checkoutBtn,
                            items.length === 0 && styles.checkoutBtnDisabled
                        ]}
                        onPress={handleCheckout}
                        disabled={items.length === 0}
                    >
                        <Text style={styles.checkoutText}>Checkout</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40
    },
    empty: {
        textAlign: "center",
        fontSize: 18,
        color: "#777",
        marginBottom: 12
    },
    goToProducts: {
        fontSize: 16,
        color: "#3A8DFD",
        fontWeight: "600",
        textDecorationLine: "underline"
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
    totalContainer: {
        flexDirection: "column"
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#666"
    },
    totalValue: {
        fontSize: 22,
        fontWeight: "700",
        color: "#0A8A34"
    },
    checkoutBtn: {
        backgroundColor: "#3A8DFD",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    checkoutBtnDisabled: {
        backgroundColor: "#ccc",
        opacity: 0.7
    },
    checkoutText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16
    },
});