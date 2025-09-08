// app/components/TimeSeriesChart.tsx
import React, { useMemo } from "react";
import { View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle } from "react-native-svg";

type InputPoint = { t: string; value: number };

export default function TimeSeriesChart({
  data,
  overlayData,
  height = 320,
  ySuffix = "m",
}: {
  data: InputPoint[]; // main: water level
  overlayData?: InputPoint[]; // rainfall
  height?: number;
  ySuffix?: string;
}) {
  const width = Dimensions.get("window").width - 32;
  // labels: show short dates
  const labels = data.map((p) => {
    const d = new Date(p.t);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  const mainValues = data.map((d) => d.value);

  // overlay (rain) scaled into comparable range for visualization
  const overlayValues = overlayData ? overlayData.map((d) => d.value) : [];
  const mainMax = Math.max(...mainValues, 1);
  const overlayMax = overlayValues.length ? Math.max(...overlayValues) : 1;
  const scale = overlayMax > 0 ? mainMax / overlayMax : 1;
  const overlayScaled = overlayValues.map((v) => v * scale);

  // simple moving average (window 7 or 5)
  const window = Math.min(7, data.length);
  const ma = mainValues.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = mainValues.slice(start, i + 1);
    const sum = slice.reduce((a, b) => a + b, 0);
    return +(sum / slice.length).toFixed(2);
  });

  // anomaly detection: value deviates from MA by more than 2*std (rough)
  const anomalies = (() => {
    const arr: number[] = [];
    for (let i = 0; i < mainValues.length; i++) {
      const start = Math.max(0, i - window + 1);
      const slice = mainValues.slice(start, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
      const variance = slice.reduce((s, v) => s + (v - mean) ** 2, 0) / slice.length || 0;
      const sd = Math.sqrt(variance);
      if (Math.abs(mainValues[i] - mean) > 2 * sd) arr.push(i);
    }
    return arr;
  })();

  const chartData = {
    labels,
    datasets: [
      { data: mainValues, color: () => "#2563eb", strokeWidth: 2, withDots: false },
      { data: ma, color: () => "#059669", strokeWidth: 2, withDots: false },
      ...(overlayValues.length ? [{ data: overlayScaled, color: () => "rgba(136,201,255,0.9)", strokeWidth: 0, withDots: false }] : []),
    ],
    legend: ["Water level", "Moving avg", overlayValues.length ? "Rainfall (scaled)" : undefined].filter(Boolean) as string[],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(37,99,235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51,65,85, ${opacity})`,
    propsForDots: { r: "3", strokeWidth: "0", stroke: "#fff" },
    strokeWidth: 2,
  };

  // decorator to draw red circles at anomalies
  const Decorator = () => {
    if (!anomalies.length) return null;
    // compute positions
    const innerWidth = width;
    const innerHeight = height - 60; // approximate chart inner area
    const max = Math.max(...mainValues);
    const min = Math.min(...mainValues);
    return (
      <Svg style={{ position: "absolute", left: 16, top: 8 }} width={innerWidth} height={innerHeight + 20}>
        {anomalies.map((idx) => {
          const x = (idx / Math.max(1, labels.length - 1)) * innerWidth;
          const relative = (mainValues[idx] - min) / Math.max(1e-6, max - min);
          const y = innerHeight - relative * innerHeight;
          return <Circle key={idx} cx={x} cy={y} r={5} fill="#dc2626" />;
        })}
      </Svg>
    );
  };

  return (
    <View>
      <LineChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        withDots={false}
        style={{ borderRadius: 12 }}
        yAxisSuffix={ySuffix}
        fromZero
      />
      <Decorator />
      <View style={{ paddingHorizontal: 4, marginTop: 8 }}>
        <Text style={{ fontSize: 12, color: "#6b7280" }}>Note: rainfall is scaled visually on the chart for comparison.</Text>
      </View>
    </View>
  );
}
