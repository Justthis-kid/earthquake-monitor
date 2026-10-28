'use client';

import { useMemo } from "react";
import Map, { Layer, Marker, Source } from "react-map-gl/maplibre";
import type { Feature, Polygon } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { circle } from "@turf/turf";
import { EARTHQUAKE_MIN_MAGNITUDE } from "@/constants/earthquakeThresholds";
import type { EarthquakeFeature } from "@/types/earthquake";
import PulseLayer from "@/components/map/PulseLayer";

const maplibreModule = import("maplibre-gl").then((maplibre) => {
	maplibre.setWorkerUrl("/maplibre-gl-worker.mjs");
	return maplibre;
});

interface EarthquakeMapProps {
	earthquakes: EarthquakeFeature[];
	zoneCenter: [longitude: number, latitude: number] | null;
	zoneRadiusKm: number;
}

export default function EarthquakeMap({ earthquakes, zoneCenter, zoneRadiusKm }: EarthquakeMapProps) {
	const zone = useMemo<Feature<Polygon> | null>(
		() => (zoneCenter ? circle(zoneCenter, zoneRadiusKm, { steps: 64, units: "kilometers" }) : null),
		[zoneCenter, zoneRadiusKm],
	);

	return (
		<div className="map-frame" id="map-root" aria-label="World earthquake map">
			<Map
				initialViewState={{ longitude: 12, latitude: 20, zoom: 1.45 }}
				mapStyle="https://demotiles.maplibre.org/style.json"
				mapLib={maplibreModule}
				canvasContextAttributes={{ preserveDrawingBuffer: true }}
				reuseMaps
			>
				{zone && (
					<Source id="tracking-zone" type="geojson" data={zone}>
						<Layer
							id="tracking-zone-fill"
							type="fill"
							paint={{ "fill-color": "#d98d58", "fill-opacity": 0.13 }}
						/>
						<Layer
							id="tracking-zone-outline"
							type="line"
							paint={{ "line-color": "#be6746", "line-width": 1.5, "line-dasharray": [3, 2] }}
						/>
					</Source>
				)}
				{earthquakes
					.filter((earthquake) => (earthquake.properties.mag ?? 0) >= EARTHQUAKE_MIN_MAGNITUDE)
					.map((earthquake) => {
						const magnitude = earthquake.properties.mag ?? 0;
						const [longitude, latitude] = earthquake.geometry.coordinates;

						return (
							<Marker key={earthquake.id} longitude={longitude} latitude={latitude} anchor="center">
								<PulseLayer magnitude={magnitude} title={earthquake.properties.place} />
							</Marker>
						);
					})}
			</Map>
			<div className="map-scale" aria-hidden="true"><span>Magnitude</span><i /><b>2.5</b><b>6+</b></div>
		</div>
	);
}
