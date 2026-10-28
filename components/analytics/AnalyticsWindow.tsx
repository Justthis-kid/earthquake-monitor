'use client';

import { useMemo } from "react";
import { Activity, CircleDot, Crosshair, TrendingUp } from "lucide-react";
import { calculateStats } from "@/lib/analytics/calculateStats";
import { filterWithinZone } from "@/lib/analytics/filterWithinZone";
import type { EarthquakeFeature } from "@/types/earthquake";

interface AnalyticsWindowProps {
	earthquakes: EarthquakeFeature[];
	onZoneRadiusChange: (radius: number) => void;
	zoneRadiusKm: number;
}

export default function AnalyticsWindow({ earthquakes, zoneRadiusKm, onZoneRadiusChange }: AnalyticsWindowProps) {
	const stats = useMemo(() => calculateStats(earthquakes), [earthquakes]);
	const strongest = useMemo(
		() => earthquakes.reduce<EarthquakeFeature | null>((largest, earthquake) => {
			const magnitude = earthquake.properties.mag ?? -1;
			return !largest || magnitude > (largest.properties.mag ?? -1) ? earthquake : largest;
		}, null),
		[earthquakes],
	);
	const zoneCount = useMemo(() => {
		if (!strongest) return 0;
		const [longitude, latitude] = strongest.geometry.coordinates;
		return filterWithinZone(earthquakes, [longitude, latitude], zoneRadiusKm).length;
	}, [earthquakes, strongest, zoneRadiusKm]);

	return (
		<section className="analytics-panel" aria-labelledby="analytics-title">
			<div className="section-heading">
				<div><span className="eyebrow">Daily brief</span><h2 id="analytics-title">Activity summary</h2></div>
				<Activity size={18} aria-hidden="true" />
			</div>
			<div className="stat-grid">
				<article className="stat-item"><CircleDot size={16} /><span>Events</span><strong>{stats.count.toLocaleString()}</strong></article>
				<article className="stat-item"><TrendingUp size={16} /><span>M 4+</span><strong>{stats.significantCount.toLocaleString()}</strong></article>
				<article className="stat-item stat-item--wide"><Crosshair size={16} /><span>Strongest</span><strong>{stats.strongestMagnitude === null ? "—" : `M ${stats.strongestMagnitude.toFixed(1)}`}</strong></article>
			</div>
			<div className="zone-summary">
				<div className="zone-summary__label"><span>Near strongest event</span><strong>{zoneCount.toLocaleString()} events</strong></div>
				<label htmlFor="zone-radius">Radius <b>{zoneRadiusKm} km</b></label>
				<input
					id="zone-radius"
					type="range"
					min="100"
					max="1000"
					step="50"
					value={zoneRadiusKm}
					onChange={(event) => onZoneRadiusChange(Number(event.target.value))}
					disabled={!strongest}
				/>
			</div>
			{strongest && <p className="largest-place">{strongest.properties.place}</p>}
		</section>
	);
}
