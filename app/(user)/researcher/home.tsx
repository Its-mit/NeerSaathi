// app/(user)/home.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
// Update the import path if AuthContext is located elsewhere, for example:
import { useAuth } from "../../context/AuthContext";
// Or ensure that '../context/AuthContext.tsx' exists and exports useAuth

export default function Home() {
  const router = useRouter();
  const { state } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome{state.user ? `, ${state.user.role}` : ""}</Text>
      <Text style={styles.subtitle}>Real-time groundwater monitoring and climate data for your area</Text>

      <View style={{ height: 16 }} />
      <Pressable style={styles.btn} onPress={() => router.push("/(user)/live")}>
        <Text style={styles.btnText}>Live Groundwater Monitor</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={() => router.push("/(user)/profile")}>
        <Text style={styles.btnText}>Profile</Text>
      </Pressable>

      <Pressable style={styles.btnOutline} onPress={() => router.push("/(user)/faq")}>
        <Text style={styles.btnOutlineText}>FAQ & AI Assistant (placeholder)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "flex-start" },
  title: { fontSize: 26, fontWeight: "700", marginTop: 32 },
  subtitle: { color: "#4b5563", marginTop: 6 },
  btn: { backgroundColor: "#2563eb", padding: 14, borderRadius: 10, marginTop: 14 },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  btnOutline: { borderWidth: 1, borderColor: "#cbd5e1", padding: 12, borderRadius: 10, marginTop: 12 },
  btnOutlineText: { textAlign: "center" },
});
