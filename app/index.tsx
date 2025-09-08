// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  // first screen -> login flow
  return <Redirect href="/(auth)/login" />;
}
