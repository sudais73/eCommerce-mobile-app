import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useProductStore } from "../src/store/productStore";
import { useCartStore } from "../src/store/cartStore";

export default function ProductDetails() {
    const { id } = useLocalSearchParams(); 
    const { products, getProductById } = useProductStore();
     const {addToCart} = useCartStore();
     const router = useRouter();

    const product = getProductById(id)
    console.log('====================================');
    console.log(product);
    console.log('====================================');

    if (!product) {
        return (
            <View style={styles.center}>
                <Text>Product not found!</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: product.image}} style={styles.image} />

            <View style={styles.infoBox}>
                <Text style={styles.title}>{product.title}</Text>
                <Text style={styles.price}>Birr {product.price}</Text>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{product.description}</Text>

                <TouchableOpacity 
                onPress={() => addToCart(product.id, 1)}
                
                style={styles.cartBtn}>
                    <Text style={styles.cartBtnAndProceedText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.proceedToCheckOut} 
                onPress={() => router.push('/(tabs)/cart')} 
                >
                    <Text style={styles.cartBtnAndProceedText}>Proceed to Checkout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.proceedToCheckOut} 
                onPress={() => router.push('/(tabs)/home')} 
                >
                    <Text style={styles.cartBtnAndProceedText}>Add more Products</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    image: {
        width: "100%",
        height: 300,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    infoBox: {
        padding: 20
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 8
    },
    price: {
        fontSize: 20,
        fontWeight: "600",
        color: "#3A8DFD",
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginVertical: 10
    },
    description: {
        fontSize: 15,
        color: "#555",
        lineHeight: 22
    },
    cartBtn: {
        backgroundColor: "#3A8DFD",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 25,
    },
    proceedToCheckOut: {
        backgroundColor: "#47343dff",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 25,
    },
    cartBtnAndProceedText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },
});
