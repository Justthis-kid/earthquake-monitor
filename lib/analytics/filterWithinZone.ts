import { circle, booleanPointInPolygon, point } from "@turf/turf";
import type { EarthquakeFeature } from "@/types/earthquake";

export function filterWithinZone(
	earthquakes: EarthquakeFeature[],
	center: [longitude: number, latitude: number],
	radiusKm: number,
): EarthquakeFeature[] {
	const zone = circle(center, radiusKm, { steps: 48, units: "kilometers" });

	return earthquakes.filter((earthquake) =>
		booleanPointInPolygon(point(earthquake.geometry.coordinates), zone),
	);
}
