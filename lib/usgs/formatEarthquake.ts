import type { EarthquakeCollection, EarthquakeFeature } from "@/types/earthquake";

export function formatEarthquakeCollection(data: unknown): EarthquakeCollection {
	if (!data || typeof data !== "object" || !("features" in data)) {
		throw new Error("USGS returned an invalid earthquake collection.");
	}

	const collection = data as Partial<EarthquakeCollection>;
	const features = Array.isArray(collection.features)
		? collection.features.filter(isEarthquakeFeature)
		: [];

	return {
		type: "FeatureCollection",
		metadata: {
			generated: collection.metadata?.generated ?? Date.now(),
			count: features.length,
			title: collection.metadata?.title,
			url: collection.metadata?.url,
		},
		features,
	};
}

function isEarthquakeFeature(feature: unknown): feature is EarthquakeFeature {
	if (!feature || typeof feature !== "object") return false;

	const candidate = feature as Partial<EarthquakeFeature>;
	const coordinates = candidate.geometry?.coordinates;

	return (
		candidate.type === "Feature" &&
		typeof candidate.id === "string" &&
		typeof candidate.properties?.time === "number" &&
		Array.isArray(coordinates) &&
		typeof coordinates[0] === "number" &&
		typeof coordinates[1] === "number"
	);
}
