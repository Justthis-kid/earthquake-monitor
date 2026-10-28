import { create } from "zustand";
import type {
	EarthquakeFeature,
	EarthquakeLoadStatus,
} from "@/types/earthquake";

interface EarthquakeState {
	earthquakes: EarthquakeFeature[];
	selectedDate: string;
	status: EarthquakeLoadStatus;
	error: string | null;
	lastUpdated: number | null;
	setEarthquakes: (earthquakes: EarthquakeFeature[]) => void;
	setSelectedDate: (date: string) => void;
	setStatus: (status: EarthquakeLoadStatus) => void;
	setError: (error: string | null) => void;
}

export const useEarthquakeStore = create<EarthquakeState>((set) => ({
	earthquakes: [],
	selectedDate: new Date().toISOString().slice(0, 10),
	status: "idle",
	error: null,
	lastUpdated: null,
	setEarthquakes: (earthquakes) =>
		set({ earthquakes, lastUpdated: Date.now(), status: "ready", error: null }),
	setSelectedDate: (selectedDate) => set({ selectedDate }),
	setStatus: (status) => set({ status }),
	setError: (error) => set({ error, status: error ? "error" : "ready" }),
}));
