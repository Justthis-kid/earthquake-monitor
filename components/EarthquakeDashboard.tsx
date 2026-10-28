'use client';

import { useState } from "react";
import Link from "next/link";
import { Activity, AlertCircle, Radio, Waves } from "lucide-react";
import AnalyticsWindow from "@/components/analytics/AnalyticsWindow";
import DateSelector from "@/components/legend/DateSelector";
import ExportButtons from "@/components/legend/ExportButtons";
import LegendPanel from "@/components/legend/LegendPanel";
import EarthquakeMap from "@/components/map/EarthquakeMap";
import PlaybackControls from "@/components/playback/PlaybackControls";
import useEarthquakes from "@/hooks/useEarthquakes";
import { useEarthquakeStore } from "@/store/earthquakeStore";

export default function EarthquakeDashboard() {
  useEarthquakes();
  const earthquakes = useEarthquakeStore((state) => state.earthquakes);
  const selectedDate = useEarthquakeStore((state) => state.selectedDate);
  const setSelectedDate = useEarthquakeStore((state) => state.setSelectedDate);
  const status = useEarthquakeStore((state) => state.status);
  const error = useEarthquakeStore((state) => state.error);
  const lastUpdated = useEarthquakeStore((state) => state.lastUpdated);
  const [zoneRadiusKm, setZoneRadiusKm] = useState(300);

  const strongest = earthquakes.reduce<(typeof earthquakes)[number] | null>((largest, earthquake) => {
    return !largest || (earthquake.properties.mag ?? -1) > (largest.properties.mag ?? -1)
      ? earthquake
      : largest;
  }, null);
  const zoneCenter = strongest
    ? [strongest.geometry.coordinates[0], strongest.geometry.coordinates[1]] as [number, number]
    : null;

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Quakefield home">
          <span className="brand-mark"><Waves size={19} strokeWidth={2.2} /></span>
          <span>QUAKEFIELD<span className="brand-divider"> / </span><b>GLOBAL MONITOR</b></span>
        </Link>
        <div className="topbar-tools">
          <div className={`connection-status connection-status--${status}`}>
            <span className="status-light" />
            <span>{status === "loading" ? "UPDATING" : status === "error" ? "FEED ISSUE" : "USGS FEED"}</span>
          </div>
          <DateSelector value={selectedDate} onChange={setSelectedDate} />
          <ExportButtons />
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <div className="intro-block">
            <span className="eyebrow"><Radio size={13} /> EARTH SCIENCE / LIVE DATA</span>
            <h1>Earthquake<br />activity</h1>
            <p>Global seismic events, updated from the USGS earthquake catalog.</p>
          </div>

          <div className="feed-line">
            <div className="feed-line__icon"><Activity size={17} /></div>
            <div><strong>{earthquakes.length.toLocaleString()} events</strong><span>in the selected 24-hour window</span></div>
            {lastUpdated && <time dateTime={new Date(lastUpdated).toISOString()}>{new Date(lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>}
          </div>

          {error && <div className="error-banner" role="alert"><AlertCircle size={16} /><span>{error}</span></div>}

          <AnalyticsWindow
            earthquakes={earthquakes}
            zoneRadiusKm={zoneRadiusKm}
            onZoneRadiusChange={setZoneRadiusKm}
          />

          <section className="playback-panel" aria-labelledby="playback-title">
            <div className="section-heading"><div><span className="eyebrow">Time navigation</span><h2 id="playback-title">Daily playback</h2></div></div>
            <PlaybackControls />
          </section>

          <LegendPanel />
          <footer className="sidebar-footer"><span>Source: United States Geological Survey</span><a href="https://earthquake.usgs.gov/" target="_blank" rel="noreferrer">USGS <span aria-hidden="true">↗</span></a></footer>
        </aside>

        <section className="map-section" aria-label="Earthquake map and selected date">
          <div className="map-heading">
            <div><span className="eyebrow">WORLD / MERCATOR</span><h2>{new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</h2></div>
            <span className="map-event-count"><i />{earthquakes.length.toLocaleString()} catalog events</span>
          </div>
          <EarthquakeMap earthquakes={earthquakes} zoneCenter={zoneCenter} zoneRadiusKm={zoneRadiusKm} />
          <div className="map-caption"><span>Circle marks events within {zoneRadiusKm} km of the strongest event</span><span>Map tiles © MapLibre contributors</span></div>
        </section>
      </div>
    </main>
  );
}