'use client';

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { usePlayback } from "@/hooks/usePlayback";

export default function PlaybackControls() {
	const { isPlaying, speed, setSpeed, setIsPlaying, stepDate } = usePlayback();

	return (
		<div className="playback-controls">
			<button type="button" className="icon-button" onClick={() => stepDate(-1)} aria-label="Previous day" title="Previous day">
				<SkipBack size={16} />
			</button>
			<button
				type="button"
				className="play-button"
				onClick={() => setIsPlaying(!isPlaying)}
				aria-label={isPlaying ? "Pause playback" : "Play playback"}
				title={isPlaying ? "Pause playback" : "Play playback"}
			>
				{isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
			</button>
			<button type="button" className="icon-button" onClick={() => stepDate(1)} aria-label="Next day" title="Next day">
				<SkipForward size={16} />
			</button>
			<label className="speed-control">
				<span>Speed</span>
				<select value={speed} onChange={(event) => setSpeed(Number(event.target.value))} aria-label="Playback speed">
					<option value={0.5}>0.5×</option>
					<option value={1}>1×</option>
					<option value={2}>2×</option>
				</select>
			</label>
		</div>
	);
}
