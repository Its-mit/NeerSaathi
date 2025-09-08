// app/(user)/home.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);

  const fetchLiveReport = async () => {
    if (!state.location) return;
    setLoading(true);
    try {
      const { latitude, longitude } = state.location;
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,precipitation&timezone=auto`
      );

      // Get latest hourly values
      const lastIndex = res.data.hourly.time.length - 1;
      const temperature = res.data.hourly.temperature_2m[lastIndex];
      const humidity = res.data.hourly.relativehumidity_2m[lastIndex];
      const rainfall = res.data.hourly.precipitation[lastIndex];

      // Simulated groundwater trend (replace later with API)
      const groundwaterLevel = 10 + (Math.random() - 0.5) * 2;

      // Analyze reason
      let reason = "";
      if (rainfall > 5) reason = "Recent rainfall has increased groundwater recharge.";
      else if (temperature > 32) reason = "High temperature causing faster evaporation.";
      else reason = "Normal seasonal fluctuation affecting water levels.";

      // Role-based recommendation
      let recommendations = [];
      if (state.role === "Farmer") {
        recommendations.push("Use drip irrigation to save water.");
        if (rainfall < 2) recommendations.push("Avoid over-irrigating crops during dry spells.");
        if (groundwaterLevel < 9) recommendations.push("Groundwater is low, switch to less water-intensive crops.");
      } else if (state.role === "Household") {
        recommendations.push("Fix leaking taps and use water-saving appliances.");
        if (groundwaterLevel < 9) recommendations.push("Avoid excessive water usage during this low groundwater period.");
      } else if (state.role === "Industry") {
        recommendations.push("Implement water recycling systems in your plant.");
        if (rainfall < 2) recommendations.push("Monitor water withdrawal closely during low rainfall.");
      } else {
        recommendations.push("Study the impact of climate on groundwater trends and publish findings.");
      }

      setReport({
        groundwaterLevel,
        temperature,
        humidity,
        rainfall,
        reason,
        recommendations,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveReport();
    const interval = setInterval(fetchLiveReport, 5 * 60 * 1000); // update every 5 min
    return () => clearInterval(interval);
  }, [state.location]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to NeerSaathi</Text>
      <Text style={styles.subtitle}>Real-time groundwater & climate insights for your area</Text>

      <View style={{ height: 16 }} />
      <Pressable style={styles.btn} onPress={() => router.push("/(user)/live")}>
        <Text style={styles.btnText}>Live Groundwater Monitor</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={() => router.push("/(user)/profile")}>
        <Text style={styles.btnText}>Profile</Text>
      </Pressable>

      <Pressable style={styles.btnOutline} onPress={() => router.push("/(user)/faq")}>
        <Text style={styles.btnOutlineText}>FAQ & AI Assistant</Text>
      </Pressable>

      {/* ✅ Recommendation Section */}
      <View style={styles.recommendationBox}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>Live Report & Recommendations</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 10 }} />
        ) : report ? (
          <>
            <Text style={{ marginTop: 10 }}>📍 Location: {state.location?.latitude.toFixed(4)}, {state.location?.longitude.toFixed(4)}</Text>
            <Text>🌊 Groundwater Level: {report.groundwaterLevel.toFixed(2)} m</Text>
            <Text>🌡 Temperature: {report.temperature} °C</Text>
            <Text>💧 Humidity: {report.humidity} %</Text>
            <Text>🌧 Rainfall: {report.rainfall} mm</Text>
            <Text style={{ marginTop: 6, fontWeight: "600" }}>Reason: {report.reason}</Text>

            <Text style={{ marginTop: 10, fontWeight: "700" }}>Recommendations for {state.role}</Text>
            {report.recommendations.map((r: string, idx: number) => (
              <Text key={idx}>✅ {r}</Text>
            ))}
          </>
        ) : (
          <Text>No data available yet. Please enable location.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", marginTop: 32 },
  subtitle: { color: "#4b5563", marginTop: 6 },
  btn: { backgroundColor: "#2563eb", padding: 14, borderRadius: 10, marginTop: 14 },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  btnOutline: { borderWidth: 1, borderColor: "#cbd5e1", padding: 12, borderRadius: 10, marginTop: 12 },
  btnOutlineText: { textAlign: "center" },
  recommendationBox: {
    marginTop: 20,
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
});
