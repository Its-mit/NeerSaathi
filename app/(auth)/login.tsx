import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

const mockUsers = [
  {
    email: "farmer@example.com",
    phone: "9876543210",
    password: "123456",
    aadhaar: "123412341234",
    role: "farmer",
  },
  {
    email: "household@example.com",
    phone: "9876500000",
    password: "654321",
    aadhaar: "567856785678",
    role: "household",
  },
  {
    email: "industry@example.com",
    phone: "9999999999",
    password: "112233",
    aadhaar: "987698769876",
    role: "industry",
  },
  {
    email: "research@example.com",
    phone: "8888888888",
    password: "445566",
    aadhaar: "876587658765",
    role: "researcher",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [role, setRole] = useState("");
  const [locationAllowed, setLocationAllowed] = useState(false);
  const router = useRouter();

  // Ask for location permission
  const handleLocationAccess = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You must allow location access to continue.");
      return;
    }
    setLocationAllowed(true);
    Alert.alert("Location Access Granted");
  };

  const handleLogin = () => {
    if (!role) {
      Alert.alert("Select Role", "Please select your role.");
      return;
    }
    if (!locationAllowed) {
      Alert.alert("Location Required", "Please allow location access to login.");
      return;
    }
    const user = mockUsers.find(
      (u) =>
        u.email === email &&
        u.phone === phone &&
        u.password === password &&
        u.aadhaar === aadhaar &&
        u.role === role
    );

    if (user) {
      Alert.alert("Login Successful", `Welcome ${role}!`);
      switch (user.role) {
        case "farmer":
          router.push("/(user)/farmer/home");
          break;
        case "household":
          router.push("/(user)/household/home");
          break;
        case "industry":
          router.push("/(user)/industry/home");
          break;
        case "researcher":
          router.push("/(user)/researcher/home");
          break;
        default:
          Alert.alert("Unknown Role", "Role not recognized.");
      }
    } else {
      Alert.alert("Invalid Credentials", "Please check your details and try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>
        Login
      </Text>


      {/* Email */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
        }}
      />

      {/* Phone */}
      <TextInput
        placeholder="Phone (10 digits)"
        value={phone}
        keyboardType="number-pad"
        maxLength={10}
        onChangeText={setPhone}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
        }}
      />

      {/* Password */}
      <TextInput
        placeholder="Password (6 digits)"
        value={password}
        secureTextEntry
        maxLength={6}
        keyboardType="number-pad"
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
        }}
      />

      {/* Aadhaar */}
      <TextInput
        placeholder="Aadhaar (12 digits)"
        value={aadhaar}
        keyboardType="number-pad"
        maxLength={12}
        onChangeText={setAadhaar}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
        }}
      />

      
      {/* Role Selection */}
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Select Role:</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
        {["farmer", "household", "industry", "researcher"].map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setRole(r)}
            style={{
              backgroundColor: role === r ? "#2563eb" : "#d1d5db",
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: role === r ? "#fff" : "#000" }}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Location Access */}
      <TouchableOpacity
        onPress={handleLocationAccess}
        style={{
          backgroundColor: locationAllowed ? "#16a34a" : "#ef4444",
          paddingVertical: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          {locationAllowed ? "Location Access Granted" : "Allow Location Access"}
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#2563eb",
          paddingVertical: 14,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}













// // this is the code where we can genarate own login id and pw in real time but it is not perpanent, after every reload it will reset
// // app/(auth)/login.tsx
// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, Button, Alert, Modal, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
// import { useRouter } from "expo-router";
// import { useAuth, Role } from "../context/AuthContext";

// const ROLES: Role[] = ["Farmer", "Household", "Industry", "Researcher"];

// export default function Login() {
//   const auth = useAuth();
//   const router = useRouter();

//   const [identifier, setIdentifier] = useState(""); // email or phone
//   const [password, setPassword] = useState("");
//   const [aadhaar, setAadhaar] = useState("");
//   const [role, setRole] = useState<Role | "">("");
//   const [showModal, setShowModal] = useState(false);

//   const requestLocationFlow = async () => {
//     setShowModal(false);
//     const ok = await auth.requestLocation();
//     if (!ok) Alert.alert("Location required", "You must allow location access to log in.");
//     else Alert.alert("Location allowed");
//   };

//   const onLogin = async () => {
//     try {
//       if (!role) return Alert.alert("Please select your role");
//       if (!identifier) return Alert.alert("Enter your email or phone as identifier");
//       if (!password || password.length < 6) return Alert.alert("Password must be at least 6 characters");
//       if (!auth.state.location) return Alert.alert("Please allow location access");
//       await auth.signIn(identifier, password);
//       // optionally you could save role server-side; for now we keep role selected locally
//       router.replace("/(user)/home");
//     } catch (e: any) {
//       Alert.alert("Login failed", e.message || "Invalid credentials");
//     }
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput style={styles.input} placeholder="Email or Phone" value={identifier} onChangeText={setIdentifier} keyboardType="email-address" />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
//       <TextInput style={styles.input} placeholder="Aadhaar (optional)" keyboardType="number-pad" value={aadhaar} onChangeText={setAadhaar} />

//       <Text style={styles.sectionTitle}>Select Role</Text>
//       <View style={styles.roleRow}>
//         {ROLES.map((r) => {
//           const selected = r === role;
//           return (
//             <TouchableOpacity key={r} style={[styles.roleBtn, selected && styles.roleBtnActive]} onPress={() => setRole(r)}>
//               <Text style={[styles.roleText, selected && styles.roleTextActive]}>{r}</Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//       <View style={{ height: 12 }} />

//       {/* location toggle button (opens modal explanation) */}
//       <TouchableOpacity style={[styles.locationBtn, auth.state.location ? styles.locationBtnActive : {}]} onPress={() => setShowModal(true)}>
//         <Text style={{ color: "#fff", fontWeight: "700" }}>{auth.state.location ? "Location Captured ✓" : "Allow Location"}</Text>
//       </TouchableOpacity>

//       <View style={{ height: 12 }} />
//       <Button title="Login" onPress={onLogin} disabled={!role || !auth.state.location} />

//       <TouchableOpacity onPress={() => router.push("/(auth)/signup")} style={{ marginTop: 15 }}>
//   <Text style={{ textAlign: "center", color: "#2563eb" }}>Don't have an account? Sign Up</Text>
// </TouchableOpacity>


//       <Modal transparent visible={showModal} animationType="slide">
//         <View style={styles.modalWrap}>
//           <View style={styles.modalBox}>
//             <Text style={styles.modalTitle}>Allow Location</Text>
//             <Text style={{ marginBottom: 14 }}>NeerSaathi needs your location to show groundwater & climate data for your area.</Text>
//             <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//               <Button title="Cancel" onPress={() => setShowModal(false)} />
//               <Button title="Allow" onPress={requestLocationFlow} />
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
//   title: { fontSize: 28, fontWeight: "700", marginBottom: 12, textAlign: "center" },
//   input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 10 },
//   sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
//   roleRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
//   roleBtn: { borderWidth: 1, borderColor: "#cbd5e1", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginRight: 8, marginBottom: 8 },
//   roleBtnActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
//   roleText: {},
//   roleTextActive: { color: "#fff", fontWeight: "700" },
//   locationBtn: { backgroundColor: "#2563eb", padding: 12, borderRadius: 8, alignItems: "center" },
//   locationBtnActive: { backgroundColor: "#059669" },
//   modalWrap: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
//   modalBox: { width: "85%", backgroundColor: "#fff", padding: 18, borderRadius: 12 },
//   modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
// });
