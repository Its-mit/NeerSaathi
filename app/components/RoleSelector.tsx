
import React from "react";
import { View, Text, Pressable } from "react-native";
import type { Role } from "../context/AuthContext";

type Props = {
  role: Role;
  setRole: (r: Role) => void;
};

const RoleButton = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: active ? "#2563eb" : "#d1d5db",
      backgroundColor: active ? "#dbeafe" : "#fff",
    }}
  >
    <Text style={{ color: active ? "#1d4ed8" : "#374151", fontWeight: "600" }}>{label}</Text>
  </Pressable>
);

export default function RoleSelector({ role, setRole }: Props) {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginVertical: 6 }}>
      <RoleButton label="Admin" active={role === "admin"} onPress={() => setRole("admin")} />
      <RoleButton label="User" active={role === "user"} onPress={() => setRole("user")} />
      <RoleButton label="Researcher" active={role === "researcher"} onPress={() => setRole("researcher")} />
    </View>
  );
}
