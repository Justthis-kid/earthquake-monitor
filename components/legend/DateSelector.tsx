'use client';

import { CalendarDays } from "lucide-react";

interface DateSelectorProps {
	value: string;
	onChange: (date: string) => void;
}

export default function DateSelector({ value, onChange }: DateSelectorProps) {
	return (
		<label className="date-control">
			<CalendarDays size={16} aria-hidden="true" />
			<span className="sr-only">Earthquake date</span>
			<input
				type="date"
				value={value}
				max={new Date().toISOString().slice(0, 10)}
				onChange={(event) => onChange(event.target.value)}
				aria-label="Earthquake date"
			/>
		</label>
	);
}
