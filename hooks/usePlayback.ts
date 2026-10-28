'use client';

import { useEffect } from "react";
import { useEarthquakeStore } from "@/store/earthquakeStore";
import { usePlaybackStore } from "@/store/playbackStore";

export function usePlayback() {
	const selectedDate = useEarthquakeStore((state) => state.selectedDate);
	const setSelectedDate = useEarthquakeStore((state) => state.setSelectedDate);
	const isPlaying = usePlaybackStore((state) => state.isPlaying);
	const speed = usePlaybackStore((state) => state.speed);
	const setIsPlaying = usePlaybackStore((state) => state.setIsPlaying);

	useEffect(() => {
		if (!isPlaying) return;

		const timer = window.setInterval(() => {
			const current = new Date(`${selectedDate}T00:00:00.000Z`);
			const today = new Date();
			current.setUTCDate(current.getUTCDate() + 1);

			if (current > today) {
				setIsPlaying(false);
				return;
			}

			setSelectedDate(current.toISOString().slice(0, 10));
		}, 1400 / speed);

		return () => window.clearInterval(timer);
	}, [isPlaying, selectedDate, setIsPlaying, setSelectedDate, speed]);

	function stepDate(days: number) {
		const current = new Date(`${selectedDate}T00:00:00.000Z`);
		current.setUTCDate(current.getUTCDate() + days);
		const nextDate = current.toISOString().slice(0, 10);
		const today = new Date().toISOString().slice(0, 10);

		if (nextDate <= today) setSelectedDate(nextDate);
		setIsPlaying(false);
	}

	return { isPlaying, speed, setSpeed: usePlaybackStore.getState().setSpeed, setIsPlaying, stepDate };
}
