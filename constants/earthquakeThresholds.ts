export const EARTHQUAKE_MIN_MAGNITUDE = 2.5;

export const magnitudeBands = [
	{ minimum: 2.5, label: "2.5–3.9", color: "#d8a43b" },
	{ minimum: 4, label: "4.0–4.9", color: "#ec7548" },
	{ minimum: 5, label: "5.0–5.9", color: "#d94c43" },
	{ minimum: 6, label: "6.0+", color: "#7b3547" },
] as const;

export function getMagnitudeColor(magnitude: number): string {
	if (magnitude >= 6) return "#7b3547";
	if (magnitude >= 5) return "#d94c43";
	if (magnitude >= 4) return "#ec7548";
	return "#d8a43b";
}
