'use client';

import { getMagnitudeColor } from "@/constants/earthquakeThresholds";

interface PulseLayerProps {
	magnitude: number;
	title: string;
}

export default function PulseLayer({ magnitude, title }: PulseLayerProps) {
	const size = Math.max(12, Math.min(34, 12 + magnitude * 3));
	const color = getMagnitudeColor(magnitude);

	return (
		<button
			className="quake-marker"
			type="button"
			aria-label={`${title}, magnitude ${magnitude.toFixed(1)}`}
			title={`${title} · M ${magnitude.toFixed(1)}`}
			style={{ "--marker-color": color, "--marker-size": `${size}px` } as React.CSSProperties}
		>
			<span className="quake-marker__pulse" />
			<span className="quake-marker__dot" />
		</button>
	);
}
