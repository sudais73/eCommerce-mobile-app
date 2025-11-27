import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "./src/store/authStore";
import { useCartStore } from "./src/store/cartStore";
import { View, ActivityIndicator } from "react-native";
import { useOrderStore } from "./src/store/orderStore";

export default function Index() {
  const { loadCart,  syncWithServer } = useCartStore();
  const {loadUser, token} = useAuthStore()
  const{ orders, fetchOrders } = useOrderStore();
 


  const [isLoading, setIsLoading] = useState(true);
  // const [token, setToken] = useState<string | null>(null);

  // Read token from AsyncStorage correctly
  useEffect(() => {
   
    const init = async () => {

      // const savedToken = await AsyncStorage.getItem("token");
       await loadUser()
      // setToken(savedToken);
      await syncWithServer()
      await fetchOrders();


      await loadCart();  
      // load cart normally
    
      setIsLoading(false);
    };

    init();
  }, [token]);

  // Loader screen
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect logic
  if (token) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
