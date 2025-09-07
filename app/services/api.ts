import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore: module '@env' has no type declarations in this project
import { API_URL } from "@env"; // comes from .env

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
