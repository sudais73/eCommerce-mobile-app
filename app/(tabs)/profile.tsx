import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import {useAuthStore} from '../src/store/authStore'
export default function Profile() {
    const router = useRouter();
  const {user, logout} = useAuthStore()

  return (
    <ScrollView style={styles.container}>
      {/* Top Section */}
      <View style={styles.header}>
        <Image source={{ uri: "https://i.pravatar.cc/300"  }} style={styles.avatar} />

        <Text style={styles.name}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Profile Actions */}
      <View style={styles.menuBox}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/orders")} >
          <Text style={styles.menuText}>My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}
            onPress={() => router.push("/cart") }
        >
          <Text style={styles.menuText}>My Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={logout}
        style={[styles.menuItem, styles.logoutBtn]}>
          <Text style={[styles.menuText, { color: "white" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  header: {
    alignItems: "center",
    paddingVertical: 35,
    backgroundColor: "#fff",
    marginBottom: 20,
    elevation: 2,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginBottom: 15,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
  },

  email: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },

  menuBox: {
    paddingHorizontal: 20,
  },

  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },

  menuText: {
    fontSize: 16,
    fontWeight: "600",
  },

  logoutBtn: {
    backgroundColor: "#c28585ff",
  },
});
