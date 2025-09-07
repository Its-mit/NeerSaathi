
import React from "react";
import { Stack, Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function ResearchLayout() {
  const { state } = useAuth();
  if (!state.isAuthenticated || state.role !== "researcher") {
    return <Redirect href="/(auth)/login" />;
  }
  return <Stack screenOptions={{ headerTitle: "Research" }} />;
}
