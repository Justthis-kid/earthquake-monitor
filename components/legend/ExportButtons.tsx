'use client';

import { FileImage, FileText, LoaderCircle } from "lucide-react";
import { useExport } from "@/hooks/useExport";

export default function ExportButtons() {
	const { isExporting, error, save } = useExport();

	return (
		<div className="export-actions">
			<button type="button" className="export-button" onClick={() => void save("png")} disabled={isExporting} title="Download map as PNG">
				{isExporting ? <LoaderCircle className="spin" size={15} /> : <FileImage size={15} />}
				<span>PNG</span>
			</button>
			<button type="button" className="export-button" onClick={() => void save("pdf")} disabled={isExporting} title="Download map as PDF">
				{isExporting ? <LoaderCircle className="spin" size={15} /> : <FileText size={15} />}
				<span>PDF</span>
			</button>
			{error && <span className="export-error" role="status">{error}</span>}
		</div>
	);
}
