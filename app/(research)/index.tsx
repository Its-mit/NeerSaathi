
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ResearchDashboard() {
  const { state, signOut } = useAuth();
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Research Dashboard</Text>
      <Text>Welcome, {String(state.profile?.email ?? "Researcher")}.</Text>

      <View style={{ marginTop: 12, gap: 10 }}>
        <Pressable style={btn}><Text style={btnText}>Live Groundwater Level</Text></Pressable>
        <Pressable style={btn}><Text style={btnText}>Climate by Area</Text></Pressable>
        <Pressable style={btn}><Text style={btnText}>Download Monthly CSV</Text></Pressable>
      </View>

      <Pressable onPress={signOut} style={[btn, { backgroundColor: "#ef4444" }]}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const btn = { backgroundColor: "#2563eb", padding: 12, borderRadius: 12 };
const btnText = { color: "#fff", fontWeight: "600", textAlign: "center" } as const;
