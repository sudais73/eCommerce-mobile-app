import { View, FlatList, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import OrderCard from '../../components/OrderCard';
import { useOrderStore } from '../src/store/orderStore';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { RefreshControl } from 'react-native';

export default function OrdersScreen() {
  const { orders, fetchOrders, loading, error } = useOrderStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleRetry = () => {
    fetchOrders();
  };

  if (loading && orders.length === 0 && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3A8DFD" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  if (error && orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <Link href={'/(tabs)/cart'} style={styles.cartLink}>
          Go to Cart
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>
      
      {orders.length > 0 && (
        <Text style={styles.orderCount}>
          {orders.length} order{orders.length !== 1 ? 's' : ''} found
        </Text>
      )}

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onCancel={() => {
              // Add cancel functionality here if needed
              console.log('Cancel order:', item._id);
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3A8DFD']}
            tintColor="#3A8DFD"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Your order history will appear here
            </Text>
            <Link href={'/(tabs)/cart'} style={styles.cartLink}>
              Go to Your Cart to Place an Order
            </Link>
          </View>
        }
        ListHeaderComponent={
          loading && orders.length > 0 ? (
            <ActivityIndicator size="small" color="#3A8DFD" style={styles.listLoader} />
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={orders.length === 0 ? styles.emptyListContent : styles.listContent}
      />
    </View>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  orderCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3A8DFD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  cartLink: {
    fontSize: 16,
    color: '#3A8DFD',
    fontWeight: '600',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listLoader: {
    marginVertical: 10,
  },
  separator: {
    height: 12,
  },
});