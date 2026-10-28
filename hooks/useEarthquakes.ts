'use client';

import { useEffect } from "react";
import { useEarthquakeStore } from "@/store/earthquakeStore";
import type { EarthquakeCollection } from "@/types/earthquake";

export default function useEarthquakes() {
	const selectedDate = useEarthquakeStore((state) => state.selectedDate);
	const setEarthquakes = useEarthquakeStore((state) => state.setEarthquakes);
	const setStatus = useEarthquakeStore((state) => state.setStatus);
	const setError = useEarthquakeStore((state) => state.setError);

	useEffect(() => {
		const controller = new AbortController();
		const isToday = selectedDate === new Date().toISOString().slice(0, 10);

		async function loadEarthquakes() {
			setStatus("loading");

			try {
				const response = await fetch(`/api/earthquakes?date=${selectedDate}`, {
					signal: controller.signal,
				});
				const data = (await response.json()) as EarthquakeCollection | { error?: string };

				if (!response.ok) {
					throw new Error("error" in data ? data.error : "Earthquake data is unavailable.");
				}

				setEarthquakes((data as EarthquakeCollection).features);
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") return;
				setError(error instanceof Error ? error.message : "Earthquake data is unavailable.");
			}
		}

		void loadEarthquakes();
		const timer = isToday ? window.setInterval(() => void loadEarthquakes(), 60_000) : undefined;

		return () => {
			controller.abort();
			if (timer !== undefined) window.clearInterval(timer);
		};
	}, [selectedDate, setEarthquakes, setError, setStatus]);
}
