
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { state, signOut } = useAuth();
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Admin Dashboard</Text>
      <Text>Welcome, {String(state.profile?.email ?? "Admin")}.</Text>

      <View style={{ marginTop: 12, gap: 10 }}>
        <Pressable style={btn}><Text style={btnText}>View Real-time Data (by location)</Text></Pressable>
        <Pressable style={btn}><Text style={btnText}>Search Area</Text></Pressable>
        <Pressable style={btn}><Text style={btnText}>User Activity</Text></Pressable>
      </View>

      <Pressable onPress={signOut} style={[btn, { backgroundColor: "#ef4444" }]}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const btn = { backgroundColor: "#2563eb", padding: 12, borderRadius: 12 };
const btnText = { color: "#fff", fontWeight: "600", textAlign: "center" } as const;
