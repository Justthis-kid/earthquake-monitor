import { getRealtimeEarthquakes } from "@/lib/usgs/getRealtimeEarthquakes";

export async function GET(request: Request) {
	const date = new URL(request.url).searchParams.get("date");
	const selectedDate = date ?? new Date().toISOString().slice(0, 10);

	if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
		return Response.json({ error: "Date must use YYYY-MM-DD format." }, { status: 400 });
	}

	const parsedDate = new Date(`${selectedDate}T00:00:00.000Z`);
	if (
		Number.isNaN(parsedDate.getTime()) ||
		parsedDate.toISOString().slice(0, 10) !== selectedDate ||
		selectedDate > new Date().toISOString().slice(0, 10)
	) {
		return Response.json({ error: "Choose a valid date that is not in the future." }, { status: 400 });
	}

	try {
		return Response.json(await getRealtimeEarthquakes(selectedDate));
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unable to load earthquakes.";
		return Response.json({ error: message }, { status: 502 });
	}
}
