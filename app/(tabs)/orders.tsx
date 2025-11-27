import { View, FlatList, Text } from 'react-native';
import OrderCard from '../../components/OrderCard';
import { useOrderStore } from '../src/store/orderStore';
import { useEffect } from 'react';

export default function OrdersScreen() {
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        My Orders
      </Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <OrderCard

          order={item}
          onCancel={() => { }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
