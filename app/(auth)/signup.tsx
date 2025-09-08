// app/(auth)/signup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, Role } from "../context/AuthContext";

const ROLES: Role[] = ["Farmer", "Household", "Industry", "Researcher"];

export default function Signup() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [role, setRole] = useState<Role | "">("");

  const onSignup = async () => {
    try {
      if (!role) return Alert.alert("Select role");
      if (!password || password.length < 6) return Alert.alert("Password must be at least 6 characters");
      // minimal validation
      await auth.signUp({ email: email || undefined, phone: phone || undefined, password, aadhaar: aadhaar || undefined, role });
      Alert.alert("Account created");
      router.replace("/(user)/home");
    } catch (e: any) {
      Alert.alert("Signup error", e.message || "Something went wrong");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput style={styles.input} placeholder="Email (optional)" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Phone (optional)" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Password (min 6)" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Aadhaar (optional)" keyboardType="number-pad" value={aadhaar} onChangeText={setAadhaar} />

      <Text style={styles.sectionTitle}>Select Role</Text>
      <View style={styles.roleRow}>
        {ROLES.map((r) => {
          const selected = role === r;
          return (
            <TouchableOpacity key={r} style={[styles.roleBtn, selected && styles.roleBtnActive]} onPress={() => setRole(r)}>
              <Text style={[styles.roleText, selected && styles.roleTextActive]}>{r}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 12 }} />
      <Button title="Create account" onPress={onSignup} />
      <TouchableOpacity onPress={() => router.push("/(auth)/login")} style={{ marginTop: 15 }}>
  <Text style={{ textAlign: "center", color: "#2563eb" }}>I have an account? Login</Text>
</TouchableOpacity>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 14, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 8, marginBottom: 8 },
  roleRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  roleBtn: { borderWidth: 1, borderColor: "#cbd5e1", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  roleBtnActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  roleText: {},
  roleTextActive: { color: "#fff", fontWeight: "700" },
});
