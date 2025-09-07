import api from "./api";

export type GroundwaterReading = {
  id: string;
  location: string;
  depth: number; // meters below ground
  timestamp: string;
};

export async function fetchGroundwaterByLocation(location: string): Promise<GroundwaterReading[]> {
  const res = await api.get(`/dwlr/location/${location}`);
  return res.data;
}

export async function fetchLatestGroundwater(): Promise<GroundwaterReading[]> {
  const res = await api.get("/dwlr/latest");
  return res.data;
}
