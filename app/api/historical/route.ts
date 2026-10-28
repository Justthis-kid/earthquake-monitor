import { getHistoricalEarthquakes } from "@/lib/usgs/getHistoricalEarthquakes";

export async function GET(request: Request) {
	const searchParams = new URL(request.url).searchParams;
	const startDate = searchParams.get("start");
	const endDate = searchParams.get("end");

	if (!startDate || !endDate) {
		return Response.json({ error: "Both start and end dates are required." }, { status: 400 });
	}

	try {
		return Response.json(await getHistoricalEarthquakes(startDate, endDate));
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unable to load historical earthquakes.";
		const status = message.startsWith("Choose a valid date range") ? 400 : 502;
		return Response.json({ error: message }, { status });
	}
}
