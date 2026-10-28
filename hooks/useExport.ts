'use client';

import { useState } from "react";
import { downloadImage, exportImage } from "@/lib/export/exportImage";
import { exportMapPDF } from "@/lib/export/exportMapPDF";

export function useExport() {
	const [isExporting, setIsExporting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function save(format: "png" | "pdf") {
		const map = document.getElementById("map-root");
		if (!(map instanceof HTMLElement)) return;

		setError(null);
		setIsExporting(true);
		try {
			const image = await exportImage(map);
			if (format === "png") {
				downloadImage(image);
			} else {
				const bytes = await exportMapPDF(image);
				const pdfBytes = new Uint8Array(bytes.length);
				pdfBytes.set(bytes);
				const blob = new Blob([pdfBytes.buffer], { type: "application/pdf" });
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = "quakefield-map.pdf";
				document.body.append(link);
				link.click();
				link.remove();
				window.setTimeout(() => URL.revokeObjectURL(url), 1000);
			}
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Map export failed.");
		} finally {
			setIsExporting(false);
		}
	}

	return { isExporting, error, save };
}
