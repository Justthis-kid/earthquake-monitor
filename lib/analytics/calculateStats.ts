import type { EarthquakeFeature } from "@/types/earthquake";

export function calculateStats(earthquakes: EarthquakeFeature[]) {
	const magnitudes = earthquakes
		.map((earthquake) => earthquake.properties.mag)
		.filter((magnitude): magnitude is number => typeof magnitude === "number");

	return {
		count: earthquakes.length,
		significantCount: magnitudes.filter((magnitude) => magnitude >= 4).length,
		strongestMagnitude: magnitudes.length ? Math.max(...magnitudes) : null,
		averageMagnitude: magnitudes.length
			? magnitudes.reduce((total, magnitude) => total + magnitude, 0) / magnitudes.length
			: null,
	};
}
