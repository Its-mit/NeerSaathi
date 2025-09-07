
import React, { createContext, useContext, useMemo, useState } from "react";
import * as Location from "expo-location";

export type Role = "admin" | "researcher" | "user";
export type UserType = "farmer" | "resident" | "industry" | null;

type AdminPayload = { email: string; mobile: string; password: string };
type ResearcherPayload = { email: string; phone: string; password: string };
type AppUserPayload = { mobile: string; email: string; aadhaar: string; password: string; userType: Exclude<UserType, null> };

type SignInPayload =
  | { role: "admin"; data: AdminPayload }
  | { role: "researcher"; data: ResearcherPayload }
  | { role: "user"; data: AppUserPayload };

export type AuthState = {
  isAuthenticated: boolean;
  role: Role | null;
  userType: UserType;
  token: string | null;
  locationGranted: boolean;
  locationCoords: { latitude: number; longitude: number } | null;
  profile: Record<string, any> | null;
};

type AuthContextShape = {
  state: AuthState;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => void;
  requestLocation: () => Promise<boolean>;
  setUserType: (t: UserType) => void;
};

const defaultState: AuthState = {
  isAuthenticated: false,
  role: null,
  userType: null,
  token: null,
  locationGranted: false,
  locationCoords: null,
  profile: null,
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>(defaultState);

  const signIn: AuthContextShape["signIn"] = async (payload) => {
    // TODO: Replace with real API call. For now, simulate success.
    setState((s) => ({
      ...s,
      isAuthenticated: true,
      role: payload.role,
      userType: payload.role === "user" ? payload.data.userType : null,
      token: "DUMMY_TOKEN",
      profile: payload.data as any,
    }));
  };

  const signOut = () => setState(defaultState);

  const requestLocation: AuthContextShape["requestLocation"] = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === "granted";
    let coords = null;
    if (granted) {
      const loc = await Location.getCurrentPositionAsync({});
      coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    }
    setState((s) => ({ ...s, locationGranted: granted, locationCoords: coords }));
    return granted;
  };

  const setUserType: AuthContextShape["setUserType"] = (t) => {
    setState((s) => ({ ...s, userType: t }));
  };

  const value = useMemo(() => ({ state, signIn, signOut, requestLocation, setUserType }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
