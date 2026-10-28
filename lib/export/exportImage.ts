import { toPng } from "html-to-image";

export async function exportImage(element: HTMLElement): Promise<string> {
	return toPng(element, {
		cacheBust: true,
		pixelRatio: 2,
		backgroundColor: "#f6f5f0",
	});
}

export function downloadImage(image: string, filename = "quakefield-map.png") {
	const link = document.createElement("a");
	link.download = filename;
	link.href = image;
	document.body.append(link);
	link.click();
	link.remove();
}
