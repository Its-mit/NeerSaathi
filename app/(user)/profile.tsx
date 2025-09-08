// app/(user)/profile.tsx
import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

export default function Profile() {
  const { state, signOut } = useAuth();
  const router = useRouter();

  const doSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {state.user ? (
        <>
          <Text style={{ marginTop: 8 }}>Role: {state.user.role}</Text>
          {state.user.email && <Text>Email: {state.user.email}</Text>}
          {state.user.phone && <Text>Phone: {state.user.phone}</Text>}
          {state.user.aadhaar && <Text>Aadhaar: {state.user.aadhaar}</Text>}
        </>
      ) : (
        <Text>No user profile found.</Text>
      )}

      <View style={{ height: 12 }} />
      {state.location ? (
        <Text>
          Location: {state.location.latitude.toFixed(5)}, {state.location.longitude.toFixed(5)}
        </Text>
      ) : (
        <Text>Location not set</Text>
      )}

      <View style={{ marginTop: 16 }}>
        <Button title="Sign out" onPress={doSignOut} color="#ef4444" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700" },
});
