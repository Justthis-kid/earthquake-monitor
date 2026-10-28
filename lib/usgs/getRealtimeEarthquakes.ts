import { formatEarthquakeCollection } from "@/lib/usgs/formatEarthquake";
import type { EarthquakeCollection } from "@/types/earthquake";

const USGS_REALTIME_URL =
	"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
const USGS_QUERY_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query";

export async function getRealtimeEarthquakes(
	date: string,
): Promise<EarthquakeCollection> {
	const today = new Date().toISOString().slice(0, 10);
	const isToday = date === today;
	const url = isToday
		? USGS_REALTIME_URL
		: `${USGS_QUERY_URL}?format=geojson&starttime=${date}T00:00:00&endtime=${getNextDay(date)}T00:00:00&orderby=time`;

	const response = await fetch(url, {
		next: { revalidate: isToday ? 60 : 86_400 },
		signal: AbortSignal.timeout(15_000),
	});

	if (!response.ok) {
		throw new Error(`USGS request failed with status ${response.status}.`);
	}

	return formatEarthquakeCollection(await response.json());
}

function getNextDay(date: string): string {
	const nextDay = new Date(`${date}T00:00:00.000Z`);
	nextDay.setUTCDate(nextDay.getUTCDate() + 1);
	return nextDay.toISOString().slice(0, 10);
}
