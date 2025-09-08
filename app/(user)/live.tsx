import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Button, ActivityIndicator } from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TimeSeriesChart from "../components/TimeSeriesChart";

type Point = { t: string; value: number };

function generateGroundwaterData(days = 60): Point[] {
  const now = Date.now();
  const arr: Point[] = [];
  const base = 10;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 3600 * 1000);
    const depth = +(base + Math.sin(i / 8) * 1.5 + (Math.random() - 0.5) * 0.8).toFixed(2);
    arr.push({ t: date.toISOString(), value: depth });
  }
  return arr;
}

export default function LiveMonitor() {
  const auth = useAuth();
  const [waterData, setWaterData] = useState<Point[]>(generateGroundwaterData());
  const [tempData, setTempData] = useState<Point[]>([]);
  const [humidityData, setHumidityData] = useState<Point[]>([]);
  const [rainData, setRainData] = useState<Point[]>([]);
  const [loadingClimate, setLoadingClimate] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const [running, setRunning] = useState(true);

  // Fetch live climate data
  const fetchClimateData = async () => {
    if (!auth.state.location) return;
    setLoadingClimate(true);
    try {
      const { latitude, longitude } = auth.state.location;
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,precipitation&timezone=auto`
      );
      const hourly = res.data.hourly;
      setTempData(hourly.time.map((t: string, i: number) => ({ t, value: hourly.temperature_2m[i] })));
      setHumidityData(hourly.time.map((t: string, i: number) => ({ t, value: hourly.relativehumidity_2m[i] })));
      setRainData(hourly.time.map((t: string, i: number) => ({ t, value: hourly.precipitation[i] })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClimate(false);
    }
  };

  useEffect(() => {
    fetchClimateData();
    const climateTimer = setInterval(fetchClimateData, 10 * 60 * 1000);
    return () => clearInterval(climateTimer);
  }, [auth.state.location]);

  // Real-time groundwater update every 5s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setWaterData((prev) => {
        const last = prev[prev.length - 1];
        const nextVal = +(last.value + (Math.random() - 0.45) * 0.6).toFixed(2);
        const ts = new Date().toISOString();
        return [...prev.slice(prev.length > 59 ? 1 : 0), { t: ts, value: nextVal }];
      });
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Trend report generator
  const getTrendReport = (data: Point[], label: string) => {
    if (data.length < 3) return `${label}: No data`;
    const last = data[data.length - 1].value;
    const prev = data[data.length - 3].value;
    const diff = last - prev;
    let trend = "stable";
    if (diff > 0.2) trend = "increasing";
    if (diff < -0.2) trend = "decreasing";
    return `${label}: ${last.toFixed(2)} (${trend})`;
  };

  if (!auth.state.location) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Please enable location access in profile to view live data.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
        Live Groundwater & Climate Dashboard
      </Text>
      <Text style={{ marginBottom: 8 }}>
        Location: {auth.state.location.latitude.toFixed(4)}, {auth.state.location.longitude.toFixed(4)}
      </Text>

      {/* Groundwater Section */}
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Groundwater Level</Text>
      <TimeSeriesChart data={waterData} height={300} ySuffix="m" />
      <Text style={{ marginVertical: 8, fontSize: 16 }}>{getTrendReport(waterData, "Groundwater")}</Text>

      {/* Climate Section */}
      <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 16 }}>Climate Conditions</Text>
      {loadingClimate ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          <Text style={{ marginTop: 10 }}>Temperature</Text>
          <TimeSeriesChart data={tempData.slice(-60)} height={200} ySuffix="°C" />
          <Text>{getTrendReport(tempData, "Temperature")}</Text>

          <Text style={{ marginTop: 10 }}>Humidity</Text>
          <TimeSeriesChart data={humidityData.slice(-60)} height={200} ySuffix="%" />
          <Text>{getTrendReport(humidityData, "Humidity")}</Text>

          <Text style={{ marginTop: 10 }}>Rainfall</Text>
          <TimeSeriesChart data={rainData.slice(-60)} height={200} ySuffix="mm" />
          <Text>{getTrendReport(rainData, "Rainfall")}</Text>
        </>
      )}
    </ScrollView>
  );
}
