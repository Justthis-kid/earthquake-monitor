'use client';

import { magnitudeBands } from "@/constants/earthquakeThresholds";

export default function LegendPanel() {
	return (
		<section className="legend-panel" aria-labelledby="legend-title">
			<h2 id="legend-title">Magnitude</h2>
			<ul>
				{magnitudeBands.map((band) => (
					<li key={band.label}>
						<span className="legend-swatch" style={{ backgroundColor: band.color }} />
						<span>{band.label}</span>
					</li>
				))}
			</ul>
			<p>Markers show events M 2.5 and above</p>
		</section>
	);
}
