import { create } from "zustand";
import { api } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { router } from "expo-router";

interface User {
  id: string;
  username: string;
  email: string;
  cartData: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  loadUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  // ============================
  // REGISTER
  // ============================
  register: async (data) => {
    try {
      set({ loading: true, error: null });

      const res = await api.post("/auth/register", data);

      set({ user: res.data.user, loading: false });

      Alert.alert("Success 🎉", "Account created successfully!");
      router.replace("/(auth)/login");

    } catch (error: any) {
      set({
        error: error?.response?.data?.msg || "Registration failed",
        loading: false,
      });
      Alert.alert("Error", error?.response?.data?.msg || "Registration failed");
    }
  },

  // ============================
  // LOGIN
  // ============================
  login: async (data) => {
    try {
      set({ loading: true, error: null });

      const res = await api.post("/auth/login", data);
      const { token, user } = res.data;

      // Save token
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
      await AsyncStorage.setItem("token", token);

      set({ user, token, loading: false });

      Alert.alert("Welcome 🎉", "Login successful!");
      router.replace("(tabs)/home");

    } catch (error: any) {
      set({
        error: error?.response?.data?.msg || "Login failed",
        loading: false,
      });

      Alert.alert("Error", error?.response?.data?.msg || "Login failed");
    }
  },

  // ============================
  // LOAD USER (AUTO-LOGIN)
  // ============================
 loadUser: async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) return;

    // set global axios token
    api.defaults.headers.common["authorization"] = "Bearer " + token;

    // send token directly (important!)
    const res = await api.get("/auth/me", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  
    set({ user: res.data, token });

  } catch (error) {
    console.log("Auto-login failed");
  }
},

  // ============================
  // LOGOUT
  // ============================
  logout: () => {
    AsyncStorage.removeItem("token");

    set({ user: null, token: null });

    Alert.alert("Logged Out", "You have logged out.");
    router.replace("/(auth)/login");
  },
}));
