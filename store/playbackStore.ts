import { create } from "zustand";

interface PlaybackState {
	isPlaying: boolean;
	speed: number;
	setIsPlaying: (isPlaying: boolean) => void;
	setSpeed: (speed: number) => void;
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
	isPlaying: false,
	speed: 1,
	setIsPlaying: (isPlaying) => set({ isPlaying }),
	setSpeed: (speed) => set({ speed }),
}));
