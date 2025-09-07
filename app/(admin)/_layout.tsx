
import React from "react";
import { Stack, Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { state } = useAuth();
  if (!state.isAuthenticated || state.role !== "admin") {
    return <Redirect href="/(auth)/login" />;
  }
  return <Stack screenOptions={{ headerTitle: "Admin" }} />;
}
