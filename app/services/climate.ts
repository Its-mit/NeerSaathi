import api from "./api";

export type ClimateData = {
  temperature: number; // °C
  rainfall: number;    // mm
  humidity: number;    // %
  timestamp: string;
};

export async function fetchClimateByCoords(lat: number, lon: number): Promise<ClimateData> {
  const res = await api.get(`/climate?lat=${lat}&lon=${lon}`);
  return res.data;
}

export async function fetchClimateByLocation(location: string): Promise<ClimateData> {
  const res = await api.get(`/climate/location/${location}`);
  return res.data;
}
