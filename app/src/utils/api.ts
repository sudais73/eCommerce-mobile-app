import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = axios.create({
  baseURL: "https://mobile-backend-hxn5.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
  }
  return config;
});
