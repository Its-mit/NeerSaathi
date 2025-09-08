// app/(user)/live.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import TimeSeriesChart from "../components/TimeSeriesChart";
import { useAuth } from "../context/AuthContext";

type Point = { t: string; value: number };

function makeInitialSeries(days = 60) {
  const now = Date.now();
  const base = 10; // baseline water level in meters
  const arr: Point[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 3600 * 1000);
    // gentle seasonality + noise
    const depth = +(base + Math.sin((i / 8)) * 1.5 + (Math.random() - 0.5) * 0.8).toFixed(2);
    arr.push({ t: date.toISOString(), value: depth });
  }
  return arr;
}

function makeInitialRain(days = 60) {
  const now = Date.now();
  const arr: Point[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 3600 * 1000);
    const rain = Math.random() > 0.8 ? Math.round(Math.random() * 30) : Math.round(Math.random() * 6);
    arr.push({ t: date.toISOString(), value: rain });
  }
  return arr;
}

export default function LiveMonitor() {
  const auth = useAuth();
  const [waterData, setWaterData] = useState<Point[]>(() => makeInitialSeries());
  const [rainData, setRainData] = useState<Point[]>(() => makeInitialRain());
  const intervalRef = useRef<number | null>(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    // push a new datapoint every 5 seconds to simulate realtime
    intervalRef.current = setInterval(() => {
      setWaterData((prev) => {
        const last = prev[prev.length - 1];
        const nextVal = +(last.value + (Math.random() - 0.45) * 0.6).toFixed(2);
        const ts = new Date().toISOString();
        const next = [...prev.slice(prev.length > 59 ? 1 : 0), { t: ts, value: nextVal }];
        return next;
      });
      setRainData((prev) => {
        const nextRain = Math.random() > 0.85 ? Math.round(Math.random() * 30) : Math.round(Math.random() * 4);
        const ts = new Date().toISOString();
        const next = [...prev.slice(prev.length > 59 ? 1 : 0), { t: ts, value: nextRain }];
        return next;
      });
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const toggle = () => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setRunning(false);
    } else {
      // restart
      intervalRef.current = setInterval(() => {
        setWaterData((prev) => {
          const last = prev[prev.length - 1];
          const nextVal = +(last.value + (Math.random() - 0.45) * 0.6).toFixed(2);
          const ts = new Date().toISOString();
          const next = [...prev.slice(prev.length > 59 ? 1 : 0), { t: ts, value: nextVal }];
          return next;
        });
        setRainData((prev) => {
          const nextRain = Math.random() > 0.85 ? Math.round(Math.random() * 30) : Math.round(Math.random() * 4);
          const ts = new Date().toISOString();
          const next = [...prev.slice(prev.length > 59 ? 1 : 0), { t: ts, value: nextRain }];
          return next;
        });
      }, 5000);
      setRunning(true);
    }
  };

  if (!auth.state.location) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Location not available. Please enable location in Profile/Login page.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Live Groundwater Monitor</Text>
      <Text style={{ color: "#4b5563", marginBottom: 8 }}>
        Location: {auth.state.location?.latitude.toFixed(4)}, {auth.state.location?.longitude.toFixed(4)}
      </Text>

      <TimeSeriesChart data={waterData} overlayData={rainData} height={320} ySuffix="m" />

      <View style={{ height: 12 }} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button title={running ? "Pause" : "Resume"} onPress={toggle} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>Latest</Text>
        <Text>Water level: {waterData[waterData.length - 1].value} m</Text>
        <Text>Rainfall (recent): {rainData[rainData.length - 1].value} mm</Text>
      </View>
    </View>
  );
}
