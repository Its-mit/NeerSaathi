
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const { state, signOut } = useAuth();
  const loc = state.locationCoords ? `(${state.locationCoords.latitude.toFixed(4)}, ${state.locationCoords.longitude.toFixed(4)})` : "Not granted";
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>User Dashboard</Text>
      <Text>Role type: {state.userType ?? "-"}</Text>
      <Text>Location: {loc}</Text>

      <View style={{ marginTop: 12, gap: 10 }}>
        <Pressable style={btn}><Text style={btnText}>Live Groundwater Level</Text></Pressable>
        <Pressable style={btn}><Text style={btnText}>Climate near me</Text></Pressable>
        <Pressable style={btn}><Text style={btnText}>Recommendations</Text></Pressable>
        <Pressable style={btn}><Text style={btnText}>FAQ & AI Assistant</Text></Pressable>
      </View>

      <Pressable onPress={signOut} style={[btn, { backgroundColor: "#ef4444" }]}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const btn = { backgroundColor: "#2563eb", padding: 12, borderRadius: 12 };
const btnText = { color: "#fff", fontWeight: "600", textAlign: "center" } as const;
