// app/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { v4 as uuidv4 } from "uuid"; // we'll generate ids; if not installed, we will fallback below

export type Role = "Farmer" | "Household" | "Industry" | "Researcher";

type User = {
  id: string;
  email?: string;
  phone?: string;
  aadhaar?: string;
  role: Role;
};

type AuthState = {
  role: string;
  user: User | null;
  token: string | null;
  location: { latitude: number; longitude: number } | null;
  isLoading: boolean;
};

type AuthContextType = {
  state: AuthState;
  signUp: (payload: { email?: string; phone?: string; password: string; aadhaar?: string; role: Role }) => Promise<void>;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  requestLocation: () => Promise<boolean>;
};

const USERS_KEY = "NS_USERS";
const PROFILE_KEY = "NS_PROFILE";
const TOKEN_KEY = "NS_TOKEN";
const LOCATION_KEY = "NS_LOCATION";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function safeUuid() {
  try {
    // prefer uuid package if available, otherwise fallback
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { v4 } = require("uuid");
    return v4();
  } catch {
    return String(Math.random()).slice(2);
  }
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ role: "", user: null, token: null, location: null, isLoading: true });

  useEffect(() => {
    (async () => {
      try {
        const profileStr = await AsyncStorage.getItem(PROFILE_KEY);
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const locStr = await AsyncStorage.getItem(LOCATION_KEY);
        const profile = profileStr ? (JSON.parse(profileStr) as User) : null;
        const loc = locStr ? JSON.parse(locStr) : null;
        setState({ role: profile?.role ?? "", user: profile, token: token, location: loc, isLoading: false });
      } catch (e) {
        setState({ role: "", user: null, token: null, location: null, isLoading: false });
      }
    })();
  }, []);

  // signup stores a local user (demo). In production replace with API call.
  const signUp = async ({ email, phone, password, aadhaar, role }: { email?: string; phone?: string; password: string; aadhaar?: string; role: Role }) => {
    // read existing users
    const raw = await AsyncStorage.getItem(USERS_KEY);
    const users = raw ? JSON.parse(raw) : [];
    // check duplicate by email/phone
    if (email && users.find((u: any) => u.email === email)) throw new Error("User with this email already exists");
    if (phone && users.find((u: any) => u.phone === phone)) throw new Error("User with this phone already exists");

    const id = safeUuid();
    const user = { id, email, phone, aadhaar, role };
    users.push({ ...user, password }); // store password plain for demo only
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

    // auto-login after signup
    const token = `demo-token-${id}`;
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(user));
    await AsyncStorage.setItem(TOKEN_KEY, token);
    setState((s) => ({ ...s, user, token }));
  };

  const signIn = async (identifier: string, password: string) => {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    const users = raw ? JSON.parse(raw) : [];
    const found = users.find((u: any) => (u.email && u.email === identifier) || (u.phone && u.phone === identifier));
    if (!found) throw new Error("User not found");
    if (found.password !== password) throw new Error("Invalid password");
    const user: User = { id: found.id, email: found.email, phone: found.phone, aadhaar: found.aadhaar, role: found.role };
    const token = `demo-token-${found.id}`;
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(user));
    await AsyncStorage.setItem(TOKEN_KEY, token);
    setState((s) => ({ ...s, user, token }));
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(PROFILE_KEY);
    await AsyncStorage.removeItem(TOKEN_KEY);
    // keep location stored or remove? we'll keep for this demo
    setState({ role: "", user: null, token: null, location: null, isLoading: false });
  };

  const requestLocation = async () => {
    // ask permission and save coords
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return false;
    const pos = await Location.getCurrentPositionAsync({});
    const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
    setState((s) => ({ ...s, location: loc }));
    return true;
  };

  const value = useMemo(() => ({ state, signUp, signIn, signOut, requestLocation }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
