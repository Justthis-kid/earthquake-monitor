export interface EarthquakeProperties {
	mag: number | null;
	place: string;
	time: number;
	updated: number;
	url: string;
	title: string;
	status?: string;
	tsunami?: number;
	felt?: number | null;
	depth: number;
}

export interface EarthquakeFeature {
	type: "Feature";
	id: string;
	properties: EarthquakeProperties;
	geometry: {
		type: "Point";
		coordinates: [longitude: number, latitude: number, depth: number];
	};
}

export interface EarthquakeCollection {
	type: "FeatureCollection";
	metadata: {
		generated: number;
		count: number;
		title?: string;
		url?: string;
	};
	features: EarthquakeFeature[];
}

export type EarthquakeLoadStatus = "idle" | "loading" | "ready" | "error";
