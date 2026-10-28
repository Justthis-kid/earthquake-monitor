import { formatEarthquakeCollection } from "@/lib/usgs/formatEarthquake";
import type { EarthquakeCollection } from "@/types/earthquake";

const USGS_QUERY_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query";
const MAX_RANGE_DAYS = 30;

export async function getHistoricalEarthquakes(
	startDate: string,
	endDate: string,
): Promise<EarthquakeCollection> {
	const start = new Date(`${startDate}T00:00:00.000Z`);
	const end = new Date(`${endDate}T00:00:00.000Z`);
	const rangeDays = (end.getTime() - start.getTime()) / 86_400_000;

	if (
		Number.isNaN(start.getTime()) ||
		Number.isNaN(end.getTime()) ||
		start.toISOString().slice(0, 10) !== startDate ||
		end.toISOString().slice(0, 10) !== endDate ||
		rangeDays < 0 ||
		rangeDays > MAX_RANGE_DAYS ||
		endDate > new Date().toISOString().slice(0, 10)
	) {
		throw new Error("Choose a valid date range of up to 30 days ending today or earlier.");
	}

	const url = `${USGS_QUERY_URL}?format=geojson&starttime=${startDate}T00:00:00&endtime=${endDate}T23:59:59&orderby=time`;
	const response = await fetch(url, {
		next: { revalidate: 86_400 },
		signal: AbortSignal.timeout(20_000),
	});

	if (!response.ok) {
		throw new Error(`USGS request failed with status ${response.status}.`);
	}

	return formatEarthquakeCollection(await response.json());
}
