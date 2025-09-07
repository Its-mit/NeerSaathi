
import React, { useMemo, useState } from "react";
import { View, Text, Pressable, Switch, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import TextField from "../components/TextField";
import RoleSelector from "../components/RoleSelector";
import { useAuth, Role, UserType } from "../context/AuthContext";

const isEmail = (v: string) => /.+@.+\..+/.test(v);
const isPhone = (v: string) => /^\d{10}$/.test(v.replace(/\D/g, ""));
const isAadhaar = (v: string) => /^\d{12}$/.test(v.replace(/\D/g, ""));

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, requestLocation, setUserType } = useAuth();
  const [role, setRole] = useState<Role>("user");
  const [locationOn, setLocationOn] = useState<boolean>(false);

  // Admin fields
  const [adminEmail, setAdminEmail] = useState("");
  const [adminMobile, setAdminMobile] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Researcher fields
  const [resEmail, setResEmail] = useState("");
  const [resPhone, setResPhone] = useState("");
  const [resPassword, setResPassword] = useState("");

  // User fields
  const [userMobile, setUserMobile] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAadhaar, setUserAadhaar] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userType, setUserTypeLocal] = useState<UserType>(null);

  const locationToggle = async (value: boolean) => {
    setLocationOn(value);
    if (value) {
      const ok = await requestLocation();
      if (!ok) Alert.alert("Location permission denied", "You can continue, but area-wise data will be limited.");
    }
  };

  const ready = useMemo(() => {
    if (role === "admin") {
      return isEmail(adminEmail) && isPhone(adminMobile) && adminPassword.length >= 6;
    }
    if (role === "researcher") {
      return isEmail(resEmail) && isPhone(resPhone) && resPassword.length >= 6;
    }
    // user
    return isPhone(userMobile) && isEmail(userEmail) && isAadhaar(userAadhaar) && userPassword.length >= 6 && !!userType;
  }, [role, adminEmail, adminMobile, adminPassword, resEmail, resPhone, resPassword, userMobile, userEmail, userAadhaar, userPassword, userType]);

  const onSubmit = async () => {
    try {
      if (role === "admin") {
        await signIn({ role, data: { email: adminEmail, mobile: adminMobile, password: adminPassword } });
        router.replace("/(admin)");
      } else if (role === "researcher") {
        await signIn({ role, data: { email: resEmail, phone: resPhone, password: resPassword } });
        router.replace("/(research)");
      } else {
        if (!userType) return;
        setUserType(userType);
        await signIn({ role, data: { mobile: userMobile, email: userEmail, aadhaar: userAadhaar, password: userPassword, userType } });
        router.replace("/(user)");
      }
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Something went wrong");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 60 }}>
          <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 8 }}>NeerSaathi</Text>
          <Text style={{ fontSize: 16, color: "#4b5563", marginBottom: 16 }}>Groundwater level monitoring and guidance</Text>

          <RoleSelector role={role} setRole={setRole} />

          {role === "admin" && (
            <View style={{ marginTop: 12 }}>
              <TextField label="Email" value={adminEmail} onChangeText={setAdminEmail} placeholder="admin@example.com" keyboardType="email-address" autoCapitalize="none" />
              <TextField label="Mobile (10 digits)" value={adminMobile} onChangeText={setAdminMobile} placeholder="9876543210" keyboardType="phone-pad" />
              <TextField label="Password (min 6 chars)" value={adminPassword} onChangeText={setAdminPassword} placeholder="••••••••" secureTextEntry />
            </View>
          )}

          {role === "researcher" && (
            <View style={{ marginTop: 12 }}>
              <TextField label="Email" value={resEmail} onChangeText={setResEmail} placeholder="researcher@example.com" keyboardType="email-address" autoCapitalize="none" />
              <TextField label="Phone (10 digits)" value={resPhone} onChangeText={setResPhone} placeholder="9876543210" keyboardType="phone-pad" />
              <TextField label="Password (min 6 chars)" value={resPassword} onChangeText={setResPassword} placeholder="••••••••" secureTextEntry />
            </View>
          )}

          {role === "user" && (
            <View style={{ marginTop: 12 }}>
              <TextField label="Mobile (10 digits)" value={userMobile} onChangeText={setUserMobile} placeholder="9876543210" keyboardType="phone-pad" />
              <TextField label="Email" value={userEmail} onChangeText={setUserEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
              <TextField label="Aadhaar (12 digits)" value={userAadhaar} onChangeText={setUserAadhaar} placeholder="123412341234" keyboardType="number-pad" />
              <TextField label="Password (min 6 chars)" value={userPassword} onChangeText={setUserPassword} placeholder="••••••••" secureTextEntry />

              <View style={{ marginTop: 6, flexDirection: "row", gap: 8 }}>
                {(["farmer", "resident", "industry"] as const).map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setUserTypeLocal(t)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: userType === t ? "#059669" : "#d1d5db",
                      backgroundColor: userType === t ? "#d1fae5" : "#fff",
                    }}
                  >
                    <Text style={{ fontWeight: "600", color: userType === t ? "#047857" : "#374151" }}>{t[0].toUpperCase() + t.slice(1)}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Switch value={locationOn} onValueChange={locationToggle} />
              <Text>Allow location access</Text>
            </View>
            <Pressable
              onPress={onSubmit}
              disabled={!ready}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 18,
                borderRadius: 12,
                backgroundColor: ready ? "#2563eb" : "#93c5fd",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Continue</Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 28 }}>
            <Text style={{ color: "#6b7280", fontSize: 12 }}>
              By continuing, you agree to our Terms and acknowledge the Privacy Policy.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
