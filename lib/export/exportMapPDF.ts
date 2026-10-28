import { PDFDocument } from "pdf-lib";

export async function exportMapPDF(image: string): Promise<Uint8Array> {
	const document = await PDFDocument.create();
	const page = document.addPage([960, 640]);
	const png = await document.embedPng(image);
	const scale = Math.min(920 / png.width, 600 / png.height);
	const width = png.width * scale;
	const height = png.height * scale;

	page.drawImage(png, {
		x: (960 - width) / 2,
		y: (640 - height) / 2,
		width,
		height,
	});

	return document.save();
}
