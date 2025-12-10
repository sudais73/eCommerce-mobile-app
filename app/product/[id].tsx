import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useProductStore } from "../src/store/productStore";
import { useCartStore } from "../src/store/cartStore";
import { useEffect, useState } from "react";
import { Product } from "../src/types/product";

export default function ProductDetails() {
    const { id } = useLocalSearchParams(); 
    const { products, getProductById, currentProduct, loading } = useProductStore();
    const { addToCart } = useCartStore();
    const router = useRouter();
    const [localProduct, setLocalProduct] = useState<Product | null>(null); // Add explicit type

    useEffect(() => {
        // Fetch product if not already in store
        if (id) {
            const fetchProduct = async () => {
                const productData = await getProductById(id as string);
                if (productData) {
                    setLocalProduct(productData as Product); // Cast to Product type
                }
            };
            fetchProduct();
        }
    }, [id]);

    // First check if product exists in products array
    useEffect(() => {
        if (products.length > 0 && id) {
            const foundProduct = products.find(p => p._id === id || p.id === id);
            if (foundProduct) {
                setLocalProduct(foundProduct);
            }
        }
    }, [products, id]);

    // Use currentProduct if available
    useEffect(() => {
        if (currentProduct) {
            setLocalProduct(currentProduct);
        }
    }, [currentProduct]);

    console.log('Product ID:', id);
    console.log('Current Product:', localProduct);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3A8DFD" />
            </View>
        );
    }

    if (!localProduct) {
        return (
            <View style={styles.center}>
                <Text>Product not found!</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: localProduct.image }} style={styles.image} />

            <View style={styles.infoBox}>
                <Text style={styles.title}>{localProduct.title}</Text>
                <Text style={styles.price}>Birr {localProduct.price}</Text>

                <Text style={styles.sectionTitle}>Description</Text>
                
                <Text style={styles.description}>{localProduct.description}</Text>

                <TouchableOpacity 
                    onPress={() => addToCart(localProduct._id, 1)}
                    style={styles.cartBtn}
                >
                    <Text style={styles.cartBtnAndProceedText}>Add to Cart</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.proceedToCheckOut} 
                    onPress={() => router.push('/(tabs)/cart')} 
                >
                    <Text style={styles.cartBtnAndProceedText}>Proceed to Checkout</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.proceedToCheckOut} 
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
        backgroundColor: "#fff",
       paddingTop:30
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: "90%",
        height: 300,
        borderRadius:20,
        alignItems:"center",
        alignSelf:"center"

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