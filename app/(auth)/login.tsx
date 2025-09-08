// app/(auth)/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, Alert, Modal, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, Role } from "../context/AuthContext";

const ROLES: Role[] = ["Farmer", "Household", "Industry", "Researcher"];

export default function Login() {
  const auth = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [showModal, setShowModal] = useState(false);

  const requestLocationFlow = async () => {
    setShowModal(false);
    const ok = await auth.requestLocation();
    if (!ok) Alert.alert("Location required", "You must allow location access to log in.");
    else Alert.alert("Location allowed");
  };

  const onLogin = async () => {
    try {
      if (!role) return Alert.alert("Please select your role");
      if (!identifier) return Alert.alert("Enter your email or phone as identifier");
      if (!password || password.length < 6) return Alert.alert("Password must be at least 6 characters");
      if (!auth.state.location) return Alert.alert("Please allow location access");
      await auth.signIn(identifier, password);
      // optionally you could save role server-side; for now we keep role selected locally
      router.replace("/(user)/home");
    } catch (e: any) {
      Alert.alert("Login failed", e.message || "Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput style={styles.input} placeholder="Email or Phone" value={identifier} onChangeText={setIdentifier} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Aadhaar (optional)" keyboardType="number-pad" value={aadhaar} onChangeText={setAadhaar} />

      <Text style={styles.sectionTitle}>Select Role</Text>
      <View style={styles.roleRow}>
        {ROLES.map((r) => {
          const selected = r === role;
          return (
            <TouchableOpacity key={r} style={[styles.roleBtn, selected && styles.roleBtnActive]} onPress={() => setRole(r)}>
              <Text style={[styles.roleText, selected && styles.roleTextActive]}>{r}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 12 }} />

      {/* location toggle button (opens modal explanation) */}
      <TouchableOpacity style={[styles.locationBtn, auth.state.location ? styles.locationBtnActive : {}]} onPress={() => setShowModal(true)}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>{auth.state.location ? "Location Captured ✓" : "Allow Location"}</Text>
      </TouchableOpacity>

      <View style={{ height: 12 }} />
      <Button title="Login" onPress={onLogin} disabled={!role || !auth.state.location} />

      <View style={{ height: 8 }} />
      <Button title="Create account" onPress={() => router.push("/(auth)/signup")} />

      <Modal transparent visible={showModal} animationType="slide">
        <View style={styles.modalWrap}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Allow Location</Text>
            <Text style={{ marginBottom: 14 }}>NeerSaathi needs your location to show groundwater & climate data for your area.</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button title="Cancel" onPress={() => setShowModal(false)} />
              <Button title="Allow" onPress={requestLocationFlow} />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  roleRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  roleBtn: { borderWidth: 1, borderColor: "#cbd5e1", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  roleBtnActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  roleText: {},
  roleTextActive: { color: "#fff", fontWeight: "700" },
  locationBtn: { backgroundColor: "#2563eb", padding: 12, borderRadius: 8, alignItems: "center" },
  locationBtnActive: { backgroundColor: "#059669" },
  modalWrap: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "85%", backgroundColor: "#fff", padding: 18, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
});
